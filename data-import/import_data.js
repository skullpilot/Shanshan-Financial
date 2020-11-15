const Fs = require('fs');
const Lodash = require('lodash');
const parse = require('csv-parse/lib/sync')
const Axios = require('axios');

const input = Fs.readFileSync('input_data.csv', 'utf8');

const SSF_API = "https://f067b6cmyf.execute-api.us-east-1.amazonaws.com/Prod";
const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwNTE2MDcyMSwiZXhwIjoxNjA3NzUyNzIxfQ.cKhaDCcqVYBl9YcdPFkbqSeszu01Kxh0MD4JY2rFeGc"

function createCustomer(user) {
  Axios
  .post(`${SSF_API}/customer`, customer, {
    headers: {
      "x-auth-token": userToken,
    },
  })
  .then((response) => {
      console.log(`user ${user.firstName},${user.lastName} created success with ${response.data.id}`)
      return response.data
  });
}

function createPolicy(policy) {
  Axios
  .post(`${SSF_API}/policy`, policy, {
    headers: {
      "x-auth-token": userToken,
    },
  })
  .then((response) => {
      console.log(`policy ${response.data.id} created success`)
      return response.data
  });
}

const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })

const unique_users = []

for (let record of records) {
    const firstName = record["owerner first name"]
    const lastName = record["owerner last name"]
    const name = record["owerner name"]
    const occupation = record["owerner occupation"]
    const gender = record["owerner gender"]
    const birthday = `${record["owerner year"]-record["owerner month"]}-${record["owerner date"]}`
    const street = record["owerner street"]
    const city = record['owerner city']
    const postcode = record['owerner postcode']
    const email = record['owerner email']
    const phone = record['owerner phone']
    const notes = record['memo']
    const customerSegment = record['客户分类']

    if (!Lodash.find(unique_users, user => user.firstName === firstName && user.lastName === lastName)) {
        unique_users.push({firstName, lastName, name, occupation, gender, birthday, street, city, postcode, email, phone, notes, customerSegment})
    }
}

for (let record of records) {
  const firstName = record["insurer first name"]
  const lastName = record["insurer last name"]
  const gender = record["insurer gender"]
  const birthday = `${record["insurer year"]-record["insurer month"]}-${record["insurer date"]}`

  if (!Lodash.find(unique_users, user => user.firstName === firstName && user.lastName === lastName)) {
    unique_users.push({firstName, lastName, gender, birthday})
  }
}


const createCustomerPromises = []
for (let user of unique_users) {
  createCustomerPromises.push(createCustomer(user))
}

const customerMap = {}

Promise.all(createCustomerPromises).then(customers => {
  const data = ""
  for (let customer of customers) {
    customerMap[`${customer.firstName}-${customer.lastName}`] = customer.id
    data += `${customer.id},${customer.firstName}-${customer.lastName}`
  }
  Fs.writeFileSync('./created_customers.csv', content)
})

const policies = []

for (let record of records) {
  const ownerId = customerMap[`${record["owerner first name"]}-${record["owerner last name"]}`]
  const insurerId = customerMap[`${record["insurer first name"]}-${record["insurer last name"]}`]
  const company = record['company']
  const policyNumber = record['policyNumber']
  const plan = record['plan']
  const faceAmount = record['faceAmount']
  let applicationDate = record['applicationDate'].split("/")
  applicationDate = `${applicationDate[2]}-${applicationDate[1]}-${applicationDate[0]}`
  const policyDate = record['policy-date'] ? `${record['policy-year']}-${record['policy-month']}-${record['policy-date']}` : ""
  const ride = record['ride']
  const rate = record['rate']
  const frequency = record['frequency'] ? record['frequency'].toLowerCase() : ""
  const premium = record['Premium']
  const period = record['period']
  const extraDeposit = record['extraDeposit']
  const extraPeriod = record['extraPeriod']
  const beneficaries = record['beneficaries'] ? record['beneficaries'].toLowerCase() : ""
  const beneficariesRelation = record['relation'] ? record['relation'].toLowerCase() : ""
  const status = record['status'] ? record['status'].toLowerCase() : ""
  const familyKeyPerson = record['family key person'] ? record['family key person'].toLowerCase() : ""

  policies.push({ownerId, insurerId, company, policyNumber, plan, faceAmount, applicationDate, policyDate, ride, rate, frequency, premium, period, extraDeposit, extraPeriod, beneficaries, beneficariesRelation, status, familyKeyPerson })
}

const policyPromises = []
for (let policy of policies) {
  policyPromises.push(createPolicy(policy))
}

Promise.all(policyPromises).then(responses => {
  console.log("All polices created")
})