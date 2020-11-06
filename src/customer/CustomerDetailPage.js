import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import { actions } from "../redux/actions";

// TODO: (@peter) this page will generate following warnings:
/*
Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed
 an instance of Transition which is inside StrictMode. Instead, add a ref directly to the
  element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node
*/

const useStyles = makeStyles((theme) => ({
  TextFieldRoot: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2, 5),
      width: 300,
    },
    textAlign: "center",
  },
  ButtonRoot: {
    "& .MuiButton-root": {
      margin: theme.spacing(2, 5),
      width: 300,
    },
  },
  SelectInput: {
    margin: theme.spacing(2, 5),
    width: 300,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

function Relationships({ relationships, updateRelationships, menuItems }) {
  const classes = useStyles();

  const relationshipItems = relationships && relationships.map((relationship, index) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          aria-label="delete"
          onClick={() => {
            relationships.splice(index, 1);
            updateRelationships(relationships);
          }}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        <TextField
          label="Relation Name"
          variant="outlined"
          value={relationship.name || ""}
          onChange={(event) => {
            relationships[index].name = event.target.value;
            updateRelationships(relationships);
          }}
        />
        <span>:</span>
        <Select
          value={relationship.value}
          className={classes.SelectInput}
          onChange={(event) => {
            relationships[index].value = event.target.value;
            updateRelationships(relationships);
          }}
        >
          {menuItems}
        </Select>
      </div>
    );
  });

  return (
    <div>
      {relationshipItems}
      <Button
        variant="contained"
        onClick={() =>
          updateRelationships(relationships.concat([{ name: "", value: "" }]))
        }
      >
        Add Relationship
      </Button>
    </div>
  );
}

function CustomerDetailPage({
  customerId,
  customers,
  userToken,
  updateCustomer,
  removeCustomer,
}) {
  const customer = customers.data[customerId];

  const classes = useStyles();
  const [customerState, setCustomerState] = useState(customer);

  if (!customer) {
    return <div>Can't find the customer information</div>;
  }

  const menuItems = Object.values(customers.data).map((customer) => (
    <MenuItem
      value={customer.id}
      key={customer.id}
    >{`${customer.firstName}, ${customer.lastName}`}</MenuItem>
  ));

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomerState((prevState) => ({ ...prevState, [field]: value }));
  });

  return (
    <div className={classes.TextFieldRoot}>
      <h5>Customer Detail Info</h5>
      <div>
        <TextField
          label="Name"
          variant="outlined"
          value={customerState.name || ""}
          onChange={setField("name")}
        />
        <TextField
          label="FirstName"
          variant="outlined"
          value={customerState.firstName || ""}
          onChange={setField("firstName")}
        />
        <TextField
          label="LastName"
          variant="outlined"
          value={customerState.lastName || ""}
          onChange={setField("lastName")}
        />
        <TextField
          label="Gender"
          variant="outlined"
          value={customerState.gender || ""}
          onChange={setField("gender")}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={customerState.email || ""}
          onChange={setField("email")}
        />
        <TextField
          label="Phone"
          variant="outlined"
          value={customerState.phone || ""}
          onChange={setField("phone")}
        />
        <TextField
          label="Birthday"
          variant="outlined"
          value={customerState.birthday || ""}
          onChange={setField("birthday")}
        />
        <TextField
          label="Wechat Name"
          variant="outlined"
          value={customerState.wechatName || ""}
          onChange={setField("wechatName")}
        />
        <TextField
          label="wechat ID"
          variant="outlined"
          value={customerState.wechatID || ""}
          onChange={setField("wechatID")}
        />
        <TextField
          label="City"
          variant="outlined"
          value={customerState.city || ""}
          onChange={setField("city")}
        />
        <TextField
          label="Address"
          variant="outlined"
          value={customerState.address || ""}
          onChange={setField("address")}
        />
        <TextField
          label="Postcode"
          variant="outlined"
          value={customerState.postcode || ""}
          onChange={setField("postcode")}
        />
        <TextField
          label="Occupation"
          variant="outlined"
          value={customerState.occupation || ""}
          onChange={setField("occupation")}
        />
        <TextField
          label="CustomerSegment"
          variant="outlined"
          value={customerState.customerSegment || ""}
          onChange={setField("customerSegment")}
        />
        {/* TODO: @maria Make it similar to create customer page */}
        <TextField
          label="Notes"
          variant="outlined"
          value={customerState.notes || ""}
          onChange={setField("notes")}
        />
      </div>
      <h5>Relationships</h5>
      <Relationships
        relationships={customerState.relationships}
        updateRelationships={(relationships) =>
          setCustomerState((prev) => ({ ...prev, relationships }))
        }
        menuItems={menuItems}
      />
      <div className={classes.ButtonRoot}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            updateCustomer(customerState, userToken);

            //TODO: Maria
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            removeCustomer(customer.id, userToken);
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

function mapState(state, ownProps) {
  return {
    customers: state.customers,
    userToken: state.sessions.userToken,
    customerId: ownProps.match.params.customer_id,
  };
}

const actionCreators = {
  updateCustomer: actions.updateCustomer,
  removeCustomer: actions.removeCustomer,
};

const ConnectedCustomerDetailPage = connect(
  mapState,
  actionCreators
)(CustomerDetailPage);

export default ConnectedCustomerDetailPage;
