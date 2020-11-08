import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import * as Lodash from "lodash";
import Validator from "validator";
import { actions } from "../redux/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1, 1),
        width: 250,
      },

      textAlign: "center",
    },
    [theme.breakpoints.up("sm")]: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1, 5),
        width: 290,
      },

      textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
      "& .MuiTextField-root": {
        margin: theme.spacing(2, 5),
        width: 400,
      },
    },
  },
  label: {
    [theme.breakpoints.up("md")]: {
      "& .MuiTextField-root": {
        position: "relative",
        width: "50%",
      },
    },
  },
}));

function CreateCustomerPage({ createCustomer, userToken }) {
  const classes = useStyles();
  const [customer, setCustomer] = useState({});
  const [customerError, setCustomerError] = useState({
    firstName: { helperText: "", error: false },
    lastName: { helperText: "", error: false },
    email: { helperText: "", error: false },
    phone: { helperText: "", error: false },
    gender: { helperText: "", error: false },
  });

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomer((prevState) => ({ ...prevState, [field]: value }));
  });

  const validate = () => {
    let isValid = true;

    // TODO: 1) Add validations to fields that you think it's necessary to validate
    //       2) How to refactor these code (@maria)
    if (!customer.firstName) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        firstName: { helperText: "Please provide first name", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        firstName: { helperText: "", error: false },
      }));
    }

    if (!customer.lastName) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        lastName: { helperText: "Please provide last name", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        lastName: { helperText: "", error: false },
      }));
    }

    if (!customer.email || !Validator.isEmail(customer.email)) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        email: { helperText: "Please provide email", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        email: { helperText: "", error: false },
      }));
    }

    function validatePhone(p) {
      const phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
      return phoneRe.test(p);
    }

    if (!customer.phone || !validatePhone(customer.phone)) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        phone: { helperText: "Please provide phone", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        phone: { helperText: "", error: false },
      }));
    }

    if (!customer.gender) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        gender: { helperText: "Please provide gender", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        gender: { helperText: "", error: false },
      }));
    }

    return isValid;
  };

  // TODO: support ui form similar to detail page (@maria)
  // TODO: add validation support (@maria)
  // TODO: add specific input support (@maria) eg. date format, phone format
  return (
    <div>
      <div className={classes.root}>
        <h3>New Customer</h3>
        <div>
          <TextField
            label="First Name"
            variant="outlined"
            value={customer.firstName || ""}
            onChange={setField("firstName")}
            error={customerError.firstName.error}
            helperText={customerError.firstName.helperText}
            type="text"
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={customer.lastName || ""}
            onChange={setField("lastName")}
            error={customerError.lastName.error}
            helperText={customerError.lastName.helperText}
            type="text"
            required
          />
          <TextField
            label="Name"
            variant="outlined"
            value={customer.name || ""}
            onChange={setField("name")}
          />
          <TextField
            label="Gender"
            variant="outlined"
            value={customer.gender || ""}
            error={customerError.gender.error}
            helperText={customerError.gender.helperText}
            onChange={setField("gender")}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            value={customer.email || ""}
            onChange={setField("email")}
            error={customerError.email.error}
            helperText={customerError.email.helperText}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            value={customer.phone || ""}
            onChange={setField("phone")}
            error={customerError.phone.error}
            helperText={customerError.phone.helperText}
            required
          />

          <TextField
            type="date"
            label="Birthday"
            variant="outlined"
            value={customer.birthday || ""}
            onChange={setField("birthday")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Wechat Name"
            variant="outlined"
            value={customer.wechatName || ""}
            onChange={setField("wechatName")}
          />
          <TextField
            label="Wechat ID"
            variant="outlined"
            value={customer.wechatId || ""}
            onChange={setField("wechatId")}
          />
          <TextField
            label="City"
            variant="outlined"
            value={customer.city || ""}
            onChange={setField("city")}
            type="text"
          />
          <TextField
            label="Address"
            variant="outlined"
            value={customer.address || ""}
            onChange={setField("address")}
          />
          <TextField
            label="Postcode"
            variant="outlined"
            value={customer.postcode || ""}
            onChange={setField("postcode")}
          />
          <TextField
            label="Occupation"
            variant="outlined"
            value={customer.occupation || ""}
            onChange={setField("occupation")}
          />
          <TextField
            label="CustomerSegment"
            variant="outlined"
            value={customer.customerSegment || ""}
            onChange={setField("customerSegment")}
          />
        </div>

        <div className={classes.label}>
          <TextField
            label="Notes"
            variant="outlined"
            rows={6}
            multiline
            value={customer.notes || ""}
            onChange={setField("notes")}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            if (validate()) {
              createCustomer(customer, userToken);
            }
          }}
        >
          Create Customer
        </Button>
      </div>
    </div>
  );
}

function mapState(state) {
  return {
    userToken: state.sessions.userToken,
  };
}

const actionCreators = {
  createCustomer: actions.createCustomer,
};

const ConnectedCreateCustomerPage = connect(mapState, actionCreators)(CreateCustomerPage);

export default ConnectedCreateCustomerPage;
