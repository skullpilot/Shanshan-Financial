import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function CustomerListPage({ customers }) {
  return (
    <div>
      {customers.map((customer) => (
        <p style={{margin: "100px"}}>
          <Link to={`/customer/${customer.id}`}>
            Customer id: {customer.id} | Email: {customer.email}
          </Link>
        </p>
      ))}
    </div>
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
