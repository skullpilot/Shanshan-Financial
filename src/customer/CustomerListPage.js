import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../table"

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'phone', numeric: true, disablePadding: false, label: 'Phone Number' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'wechatId', numeric: true, disablePadding: false, label: 'Wechat ID' },
  { id: 'wechatName', numeric: true, disablePadding: false, label: 'Wechat Name' },
  { id: 'followDate', numeric: true, disablePadding: false, label: 'Followup Date' },
];

function CustomerListPage({ customers }) {
  const history = useHistory();

  return (
      <Table customers={customers} headCells={headCells} handleItemClick={(id) => history.push(`/customer/${id}`)} handleCreateItem={() => history.push(`/customer`)} createItemText="Create Customer" />
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
  };
}

const ConnectedCustomerListPage = connect(
  mapState
)(CustomerListPage);

export default ConnectedCustomerListPage;
