import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import * as Lodash from "lodash";

import { actions } from "../redux/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2, 5),
      width: 300,
    },
    textAlign: "center",
  },
}));

function CreateCustomerPage({ createCustomer }) {
  const classes = useStyles();
  const [customer, setCustomer] = useState({});

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomer((prevState) => ({ ...prevState, [field]: value }));
  });

  // TODO: support ui form similar to detail page (@maria)
  // TODO: add validation support (@maria)
  // TODO: add specific input support (@maria)
  return (
    <div>
      <div className={classes.root}>
        <h3>New Customer</h3>
        <div>
          <TextField
            label="Name"
            variant="outlined"
            value={customer.name || ''}
            onChange={setField("name")}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={customer.email || ''}
            onChange={setField("email")}
          />
          <TextField
            label="Phone"
            variant="outlined"
            value={customer.phone || ''}
            onChange={setField("phone")}
          />
          <TextField
            label="Birthday"
            variant="outlined"
            value={customer.birthday || ''}
            onChange={setField("birthday")}
          />
          <TextField
            label="Wechat Name"
            variant="outlined"
            value={customer.wechatName || ''}
            onChange={setField("wechatName")}
          />
          <TextField
            label="Wechat ID"
            variant="outlined"
            value={customer.wechatId || ''}
            onChange={setField("wechatId")}
          />
          <TextField
            label="City"
            variant="outlined"
            value={customer.city || ''}
            onChange={setField("city")}
          />
          <TextField
            label="Address"
            variant="outlined"
            value={customer.address || ''}
            onChange={setField("address")}
          />
        </div>
        <div>
          <TextField
            label="Notes"
            variant="outlined"
            rows={6}
            multiline
            value={customer.notes || ''}
            onChange={setField("notes")}
            style={{ width: "600px" }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px" }}
          onClick={() =>
            createCustomer({
              id: "100",
              ...customer,
            })
          }
        >
          Create Customer
        </Button>
      </div>
    </div>
  );
}

const actionCreators = {
  createCustomer: actions.createCustomer,
};

const ConnectedCreateCustomerPage = connect(
  null,
  actionCreators
)(CreateCustomerPage);

export default ConnectedCreateCustomerPage;
