const AWS = require("aws-sdk");
const Fs = require("fs");
// const { constant } = require("lodash");

AWS.config.update({
  region: "us-east-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const DATA_FILE = 'SSFInsurancePolicies.data';

//--------------------------- Query data --------------------------------------
// const params = {
//   TableName : "SSFInsurancePolicies"
// };

// docClient.scan(params, function(err, data) {
//   if (err) {
//       console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
//   } else {
//       console.log("Query succeeded.");
//       Fs.writeFileSync(DATA_FILE, JSON.stringify(data.Items, null, 2));
//   }
// });

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


//-----------------------------update insurance policy--------------------------------------------
// Fs.readFile("./SSFInsurancePolicies.data", (err, data) => {
//   const items = JSON.parse(data);

//   const result = items.map((item) => {
//     const modified = {...item};

//     if (modified.policyDate && !/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(item.policyDate)) {
//       const dates = item.policyDate.split("-").map((x) => {
//         if (x.length > 1) {
//           return x;
//         }
  
//         return "0" + x;
//       });
//       if (dates.length < 3) {
//         dates.push("01");
//       }
      
//       modified.policyDate = dates.join("-");
//     }

//     if (modified.applicationDate && !/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(item.applicationDate)) {
//       const dates = item.applicationDate.split("-").map((x) => {
//         if (x.length > 1) {
//           return x;
//         }
  
//         return "0" + x;
//       });
//       if (dates.length < 3) {
//         dates.push("01");
//       }
      
//       modified.applicationDate = dates.join("-");
//     }

//     return modified;
//   });

//   Fs.writeFileSync("./cleand-SSFInsurancePolicies.data", JSON.stringify(result, null, 2));
// });

//----------------------------upload cleaned SSF Insurance policy data--------------------------------------
Fs.readFile("./cleand-SSFInsurancePolicies.data", (err, data) => {
  const items = JSON.parse(data);
  for (let [index, item] of items.entries()) {
    const params = {
      TableName: "SSFCustomer",
      Item: item,
    };
    docClient.put(params, function (err, data) {
      if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("UpdateItem succeeded");
      }
    });
  }
});
