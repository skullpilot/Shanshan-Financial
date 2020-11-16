import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../table";

const headCells = [
  { id: "firstName", numeric: false, disablePadding: true, label: "First Name" },
  { id: "lastName", numeric: false, disablePadding: true, label: "Last Name" },
  { id: "phone", numeric: true, disablePadding: false, label: "Phone Number" },
  { id: "email", numeric: true, disablePadding: false, label: "Email" },
];

function CustomerListPage({ customers }) {
  const history = useHistory();

  return (
    <Table
      rows={customers}
      headCells={headCells}
      handleItemClick={(id) => history.push(`/customer/${id}`)}
      handleCreateItem={() => history.push(`/customer`)}
      createItemText="Create Customer"
    />
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
  };
}

const ConnectedCustomerListPage = connect(mapState)(CustomerListPage);

export default ConnectedCustomerListPage;
