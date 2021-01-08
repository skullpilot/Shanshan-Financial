import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "../table";
import TextField from "@material-ui/core/TextField";
import Lodash from "lodash";

const headCells = [
  { id: "firstName", numeric: false, disablePadding: true, label: "First Name" },
  { id: "lastName", numeric: false, disablePadding: true, label: "Last Name" },
  { id: "phone", numeric: true, disablePadding: false, label: "Phone Number" },
  { id: "email", numeric: true, disablePadding: false, label: "Email" },
  { id: "lastFollowupDate", numeric: false, disablePadding: false, label: "Last Followup Date" },
  { id: "lastFollowupNote", numeric: false, disablePadding: false, label: "Last Followup Note" },
  { id: "customerSegment", numeric: false, disablePadding: false, label: "Customer Segment" },
];

function CustomerListPage({ customers, policies }) {
  const history = useHistory();
  const [searchContent, setSearchContent] = useState({ searchType: null, searchValue: null });

  const customersWithFollowupInfo = customers.map(customer => {
    if (!customer.notes) {
      return {...customer, lastFollowupDate: "", lastFollowupNote: ""}
    }
    const maxKey = Lodash.max(Object.keys(customer.notes));
    return {...customer, lastFollowupDate: maxKey, lastFollowupNote: customer.notes[maxKey]}
  })

  const customerIdsWithPolicy = new Set();
  Lodash.forEach(policies, (policy) => {
    customerIdsWithPolicy.add(policy.ownerId);
    customerIdsWithPolicy.add(policy.insuredId);
  });

  const customersWithoutPolicy = Lodash.filter(customersWithFollowupInfo, (customer) => {
    return !customerIdsWithPolicy.has(customer.id);
  });

  function filterCustomer(customers, name) {
    return  Lodash.filter(customers, (customer) => {
      return (
        (customer.name && customer.name.toLowerCase().includes(name)) ||
        (customer.firstName &&
          customer.firstName.toLowerCase().includes(name)) ||
        (customer.lastName && customer.lastName.toLowerCase().includes(name))
      );
    });
  }

  const handleInputUpdate = (type, event) => {
    if (type === "CUSTOMER_NAME") {
      setSearchContent({ searchType: type, searchValue: event.target.value })
    } else if (type === "CUSTOMER_NO_POLICIES") {
      setSearchContent({ searchType: type, searchValue: event.target.checked })
    } else if (type === "CUSTOMER_SEGMENT") {
      setSearchContent({ searchType: type, searchValue: event.target.value })
    }
  }

  let displayCustomers = customersWithFollowupInfo;
  if (searchContent.searchType) {
    if (searchContent.searchType === "CUSTOMER_NAME") {
      displayCustomers = filterCustomer(customersWithFollowupInfo, searchContent.searchValue.toLowerCase())
    } else if (searchContent.searchType === "CUSTOMER_NO_POLICIES") {
      displayCustomers = searchContent.searchValue ? customersWithoutPolicy: customersWithFollowupInfo
    } else if (searchContent.searchType === "CUSTOMER_SEGMENT") {
      displayCustomers = Lodash.filter(customersWithFollowupInfo, customer => customer.customerSegment && customer.customerSegment.toLowerCase().includes(searchContent.searchValue.toLowerCase()))
    }
  }

  const searchCustomerWithoutPoliciesValue = searchContent.searchType === "CUSTOMER_NO_POLICIES" && searchContent.searchValue
  const searchCustomerValue = searchContent.searchType === "CUSTOMER_NAME" && searchContent.searchValue ? searchContent.searchValue : null
  const searchCustomerSegmentValue = searchContent.searchType === "CUSTOMER_SEGMENT" && searchContent.searchValue ? searchContent.searchValue : null

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "40px"

        }}
      >
        <FormControlLabel
          control={<Switch onChange={(event) => handleInputUpdate("CUSTOMER_NO_POLICIES", event)} />}
          label="显示未办保险用户"
          inputStyle={{ textAlign: "center" }}
          checked={searchCustomerWithoutPoliciesValue}
        />
        <TextField
          label="搜索用户名字"
          onChange={(event) => handleInputUpdate("CUSTOMER_NAME", event)}
          value={searchCustomerValue}
          inputStyle={{ textAlign: "center" }}
        />
        <div style={{width: "200px"}}>
        <TextField
          label="搜索用户类别"
          onChange={(event) => handleInputUpdate("CUSTOMER_SEGMENT", event)}
          value={searchCustomerSegmentValue}
          inputStyle={{ textAlign: "center" }}
        />
        </div>
        
      </div>
      <Table
        rows={displayCustomers}
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
