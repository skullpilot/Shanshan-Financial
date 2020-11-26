import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "../table";
import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";
const Lodash = require("lodash");

const headCells = [
  { id: "firstName", numeric: false, disablePadding: true, label: "First Name" },
  { id: "lastName", numeric: false, disablePadding: true, label: "Last Name" },
  { id: "phone", numeric: true, disablePadding: false, label: "Phone Number" },
  { id: "email", numeric: true, disablePadding: false, label: "Email" },
];

function CustomerListPage({ customers, policies }) {
  const history = useHistory();
  const [isShowCustomersWithPolicyOnly, setIsShowCustomersWithPolicyOnly] = React.useState(true);
  const [searchInput, setSearchInput] = React.useState("");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const customersWithPolicy = new Set();
  Lodash.forEach(policies, (policy) => {
    customersWithPolicy.add(policy.ownerId);
    customersWithPolicy.add(policy.insurerId);
  });

  const customersWithoutPolicy = Lodash.filter(customers, (customer) => {
    return !customersWithPolicy.has(customer.id);
  });

  function filterCustomer(customersArray) {
    const filteredCustomers = Lodash.filter(customersArray, (customer) => {
      return (
        (customer.name && customer.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (customer.firstName &&
          customer.firstName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (customer.lastName && customer.lastName.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    });
    return filteredCustomers;
  }

  const handleChangePolicy = (event) => {
    if (event.target.checked) {
      setIsShowCustomersWithPolicyOnly(false);
    } else {
      setIsShowCustomersWithPolicyOnly(true);
    }
  };

  const debounceSearchKeyword = Lodash.debounce((value) => {
    setSearchKeyword(value);
  }, 500);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
    debounceSearchKeyword(event.target.value);
  };

  let displayCustomer = isShowCustomersWithPolicyOnly
    ? filterCustomer(customers)
    : filterCustomer(customersWithoutPolicy);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Search Customer"
          onChange={handleSearch}
          value={searchInput}
          inputStyle={{ textAlign: "center" }}
          style={{ marginTop: "40px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "left",
        }}
      >
        <FormControlLabel
          control={<Switch onChange={handleChangePolicy} />}
          label="Customers with no Policies"
          style={{ marginLeft: "20px" }}
        />
      </div>
      <Table
        rows={displayCustomer}
        headCells={headCells}
        handleItemClick={(id) => history.push(`/customer/${id}`)}
        handleCreateItem={() => history.push(`/customer`)}
        createItemText="Create Customer"
      />
    </div>
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
    policies: Object.values(state.policies.data),
  };
}

const ConnectedCustomerListPage = connect(mapState)(CustomerListPage);

export default ConnectedCustomerListPage;
