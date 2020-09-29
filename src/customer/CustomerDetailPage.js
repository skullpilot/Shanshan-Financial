import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";

import { actions } from "../redux/actions";

function CustomerDetailPage({ customer, history, updateCustomer, removeCustomer }) {
  const [customerState, setCustomerState] = useState(customer);

  if (!customer) {
    return <div>Can't find the customer information</div>;
  }

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomerState((prevState) => ({ ...prevState, [field]: value }));
  });

  return (
    <div
      style={{
        alignContent: "center",
        display: "flex",
        flexDirection: "column",
        width: "500px",
      }}
    >
      <a onClick={() => history.goBack()}>GO BACK</a>
      <p>{JSON.stringify(customerState)}</p>
      <TextField
        label="Name"
        variant="outlined"
        value={customerState.name}
        onChange={setField("name")}
      />
      <TextField
        label="Email"
        variant="outlined"
        value={customerState.email}
        onChange={setField("email")}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          updateCustomer(
            customerState,
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwMDc0ODcxNiwiZXhwIjoxNjAzMzQwNzE2fQ.1cpvPyQv6fT3qeP2FvuTRUQ4KkkO7pI_atw-KqeGzuo"
          );
        }}
      >
        Submit
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          removeCustomer(
            customer.id,
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwMDc0ODcxNiwiZXhwIjoxNjAzMzQwNzE2fQ.1cpvPyQv6fT3qeP2FvuTRUQ4KkkO7pI_atw-KqeGzuo"
          );
        }}
      >
        Remove
      </Button>

    </div>
  );
}

function mapState(state, ownProps) {
  return {
    customer: state.customers.data[ownProps.match.params.customer_id],
  };
}

const actionCreators = {
  updateCustomer: actions.updateCustomer,
  removeCustomer: actions.removeCustomer
};

const ConnectedCustomerDetailPage = connect(mapState, actionCreators)(
  withRouter(CustomerDetailPage)
);

export default ConnectedCustomerDetailPage;
