const AWS = require("aws-sdk");
const Fs = require("fs");
const { constant } = require("lodash");

AWS.config.update({
  region: "us-east-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const DATA_FILE = "./SSFInsurancePolicies.data";

//--------------------------- Query data --------------------------------------
const params = {
  TableName : "SSFInsurancePolicies"
};

docClient.scan(params, function(err, data) {
  if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
      console.log("Query succeeded.");
      Fs.writeFileSync(DATA_FILE, JSON.stringify(data.Items, null, 2));
  }
});

//--------------------------- Modify data --------------------------------------

// Fs.readFile(DATA_FILE, (err, data) => {
//   const items = JSON.parse(data);
//   const result = items.map(item => {
//     if (item.birthday === "" || item.birthday === undefined) {
//       return item;
//     }

//     if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(item.birthday)) {
//       return item;
//     }

//     const dates = item.birthday.split("-").map(x => {
//       if (x.length > 1) {
//         return x;
//       }

//       return "0" + x;
//     });
//     if (dates.length < 3) {
//       dates.push("01");
//     }

//     return { ...item, birthday: dates.join("-") }
//   })

//   Fs.writeFileSync("./cleand-SSFCustomer.data", JSON.stringify(result, null, 2));
// })

//--------------------------- Update data --------------------------------------

// Fs.readFile("./cleand-SSFCustomer.data", (err, data) => {
//   const items = JSON.parse(data);
//   for (let [index, item] of items.entries()) {
//     const params = {
//       TableName: "SSFCustomer",
//       Item: item
//     };

//     console.log(`Updating the ${index} item...`);

//     docClient.put(params, function(err, data) {
//       if (err) {
//           console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//           console.log("UpdateItem succeeded");
//       }
//     });
//   }
// })





