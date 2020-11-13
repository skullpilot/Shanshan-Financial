const Fs = require('fs');
const Lodash = require('lodash');
const parse = require('csv-parse/lib/sync')
const Axios = require('axios');

const input = Fs.readFileSync('input_data.csv', 'utf8');

const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

const unique_users = []

for (let record of records) {
    const firstName = record["owerner first name"]
    const lastName = record["owerner last name"]
    const name = record["Nick name"]
    const occupation = record["Occupation"]
    const gender = record["gender"]

    if (!Lodash.find(unique_users, user => user.firstName === firstName && user.lastName === lastName)) {
        unique_users.push({firstName, lastName, name, occupation, gender})
    }
}

console.log(unique_users.length)

const SSF_API = "https://v0zyj10l7j.execute-api.us-east-2.amazonaws.com/Prod";
const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwNTE2MDcyMSwiZXhwIjoxNjA3NzUyNzIxfQ.cKhaDCcqVYBl9YcdPFkbqSeszu01Kxh0MD4JY2rFeGc"

function createCustomer(user) {
    Axios
    .post(`${SSF_API}/customer`, customer, {
      headers: {
        "x-auth-token": userToken,
      },
    })
    .then((response) => {
        console.log(`user ${user.firstName},${user.lastName} created success with ${response.id}`)
    });
}