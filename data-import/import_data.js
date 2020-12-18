const Fs = require("fs");
const Lodash = require("lodash");
const parse = require("csv-parse/lib/sync");
const Axios = require("axios");
const Moment = require("moment");

const input = Fs.readFileSync("input_data.csv", "utf8");

const SSF_API = "https://f067b6cmyf.execute-api.us-east-1.amazonaws.com/Prod";
const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwNzEyNTE4MSwiZXhwIjoxNjA5NzE3MTgxfQ.k6f6J_e4xwpQE0tbNEjnpt20u2EAaN0IqVUpUpOI-8U";

function createCustomer(customer) {
  return Axios.post(`${SSF_API}/customer`, customer, {
    headers: {
      "x-auth-token": userToken,
    },
  }).then((response) => {
    console.log(
      `user ${customer.firstName},${customer.lastName} created success with ${response.data.id}`
    );
    return response.data;
  }).catch(err => console.log(err));
}

function createPolicy(policy) {
  return Axios.post(`${SSF_API}/policy`, policy, {
    headers: {
      "x-auth-token": userToken,
    },
  }).then((response) => {
    console.log(`policy ${response.data.id} created success`);
    return response.data;
  });
}

function print_invalid_contact(records, unique_users) {
  const invalid = [];

  for (let record of records) {
    const contact = record["contact"].toLowerCase();

    if (contact === "") {
      continue;
    }

    if (!Lodash.find(unique_users, (user) => `${user.firstName} ${user.lastName}` === contact)) {
      invalid.push(contact);
    }
  }

  if (invalid.length > 0) {
    console.log(invalid);
  }
}

async function insert_customers() {
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  const unique_users = [];

  for (let record of records) {
    const firstName = record["owner first name"] || "";
    const lastName = record["owner last name"] || "";
    const name = record["owner name"] || "";
    const occupation = record["owner occupation"] || "";
    const gender = record["owner gender"] || "";
    const birthday = record["owner year"]
      ? `${record["owner year"]}-${record["owner month"]}-${record["owner date"]}`
      : "";
    const street = record["owner street"] || "";
    const city = record["owner city"] || "";
    const postcode = record["owner postcode"] || "";
    const email = record["owner email"] || "";
    const phone = record["owner phone"] || "";
    let notes = "";
    if (record["memo"]) {
      notes = {
        [Moment().format("YYYYMMDD-HH:mm:ss")]: record["memo"],
      };
    }
    const customerSegment = record["customer segment"] || "";

    if (
      !Lodash.find(
        unique_users,
        (user) => user.firstName === firstName && user.lastName === lastName
      )
    ) {
      unique_users.push({
        firstName,
        lastName,
        name,
        occupation,
        gender,
        birthday,
        street,
        city,
        postcode,
        email,
        phone,
        notes,
        customerSegment,
      });
    }
  }

  for (let record of records) {
    const firstName = record["insured first name"];
    const lastName = record["insured last name"];
    const gender = record["insured gender"];
    const birthday = record["insured year"]
      ? `${record["insured year"]}-${record["insured month"]}-${record["insured date"]}`
      : "";

    if (
      !Lodash.find(
        unique_users,
        (user) => user.firstName === firstName && user.lastName === lastName
      )
    ) {
      unique_users.push({ firstName, lastName, gender, birthday });
    }
  }

  print_invalid_contact(records, unique_users);

  let data = "";
  for (let user of unique_users) {
    const customer = await createCustomer(user);
    data += `${customer.id},${customer.firstName} ${customer.lastName}\n`;
  }

  Fs.writeFileSync("./created_customers.csv", data);
}

async function insert_policies() {
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  const customers = await Fs.readFileSync("./created_customers.csv", "utf-8");

  const customerMap = {};
  for (let customer of customers.split("\n")) {
    if (customer === "") continue;
    const [id, customerName] = customer.split(",");
    customerMap[customerName] = id;
  }

  const policies = [];

  for (let record of records) {
    const ownerId = customerMap[`${record["owner first name"]} ${record["owner last name"]}`];
    const insuredId = customerMap[`${record["insured first name"]} ${record["insured last name"]}`];
    const company = record["company"];
    const policyNumber = record["policyNumber"];
    const plan = record["plan"];
    const faceAmount = record["faceAmount"];
    let applicationDate = record["applicationDate"].split("/");
    applicationDate = `${applicationDate[2]}-${applicationDate[0]}-${applicationDate[1]}`;
    const policyDate = record["policy-date"]
      ? `${record["policy-year"]}-${record["policy-month"]}-${record["policy-date"]}`
      : "";
    const ride = record["ride"];
    const rate = record["rate"];
    const frequency = record["frequency"] ? record["frequency"].toLowerCase() : "";
    const premium = record["Premium"];
    const period = record["period"];
    const extraDeposit = record["extraDeposit"];
    const extraPeriod = record["extraPeriod"];
    const beneficiaries = record["beneficiaries"] ? record["beneficiaries"].toLowerCase() : "";
    const beneficiariesRelation = record["relation"] ? record["relation"].toLowerCase() : "";
    const status = record["status"] ? record["status"].toLowerCase() : "";

    let contactId = "";
    if (record["contact"] && customerMap[record["contact"].toLowerCase()]) {
      contactId = customerMap[record["contact"].toLowerCase()];
    }

    policies.push({
      ownerId,
      insuredId,
      contactId,
      company,
      policyNumber,
      plan,
      faceAmount,
      applicationDate,
      policyDate,
      ride,
      rate,
      frequency,
      premium,
      period,
      extraDeposit,
      extraPeriod,
      beneficiaries,
      beneficiariesRelation,
      status,
    });
  }

  let count = 0;
  for (let policy of policies) {
    await createPolicy(policy);
    console.log(count);
    count += 1;
  }
}

async function main() {
  await insert_customers();
  await insert_policies();
}

main();
