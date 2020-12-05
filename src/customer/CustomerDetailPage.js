import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Validator from "validator";
import { actions } from "../redux/actions";
import Relationships from "./Relationships";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notes from "./Notes";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { history } from "../history";
import styles from "./CustomerDetailPage.module.css";

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
  TypographyRoot: {
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
  note: {
    [theme.breakpoints.up("md")]: {
      "& .MuiTextField-root": {
        position: "relative",
        width: "50%",
      },
    },
  },
  formControl: {
    margin: theme.spacing(2, 5),
    minWidth: 300,
  },
}));

function CustomerDetailPage({
  customerId,
  customers,
  policies,
  userToken,
  updateCustomer,
  removeCustomer,
}) {
  const customer = customers.data[customerId];
  const classes = useStyles();
  const [customerState, setCustomerState] = useState(customer);
  const [customerError, setCustomerError] = useState({
    firstName: { helperText: "", error: false },
    lastName: { helperText: "", error: false },
    email: { helperText: "", error: false },
    phone: { helperText: "", error: false },
    gender: { helperText: "", error: false },
    birthday: { helperText: "", error: false },
  });

  const policyAsOwner = Lodash.filter(policies, (policy) => policy.ownerId === customer.id);
  const policyAsInsurer = Lodash.filter(policies, (policy) => policy.insurerId === customer.id);
  const policyAsContact = Lodash.filter(policies, (policy) => policy.contactId === customer.id);

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

  const validateDelete = () => {
    if (Lodash.find(policies, { insurerId: customerId } || { ownerId: customerId })) {
      return false;
    }

    Lodash.forEach(customers.data, function (customer, ID) {
      if (
        customer.relationships !== undefined &&
        ID !== customerId &&
        Lodash.find(customer.relationships, { value: customerId })
      ) {
        return false;
      }
    });
    return true;
  };

  const validate = () => {
    let isValid = true;

    if (!customerState.firstName) {
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

    if (!customerState.lastName) {
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

    if (customerState.email && !Validator.isEmail(customerState.email)) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        email: { helperText: "Please provide correct email", error: true },
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

    if (customerState.phone && !validatePhone(customerState.phone)) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        phone: { helperText: "Please provide correct phone number", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        phone: { helperText: "", error: false },
      }));
    }

    if (!customerState.gender) {
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

    if (customerState.birthday && !Validator.isDate(customerState.birthday, "YYYY-MM-DD")) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        birthday: { helperText: "Please provide birthday in format YYYY-MM-DD", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        birthday: { helperText: "", error: false },
      }));
    }
    return isValid;
  };

  function policyItem(filterdPolicy, title) {
    return (
      <div>
        <div>
          <h5>{title}</h5>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
        >
          {filterdPolicy.map((policy) => (
            <div class={styles.policyItem} onClick={() => history.push(`/policy/${policy.id}`)}>
              <Typography>
                {`Policy Owner: ${customers.data[policy.ownerId].firstName}, ${
                  customers.data[policy.ownerId].lastName
                }`}
              </Typography>
              <Typography>
                {`Policy Insurer: ${customers.data[policy.insurerId].firstName}, ${
                  customers.data[policy.insurerId].lastName
                }`}
              </Typography>
              <Typography>{`Company: ${policy.company}`}</Typography>
              <Typography>{`Plan: ${policy.plan}`}</Typography>
              <Typography>{`Policy Number: ${policy.policyNumber}`}</Typography>
              <Typography>{`Policy Date: ${policy.policyDate}`}</Typography>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          error={customerError.firstName.error}
          helperText={customerError.firstName.helperText}
          required
        />
        <TextField
          label="LastName"
          variant="outlined"
          value={customerState.lastName || ""}
          onChange={setField("lastName")}
          error={customerError.lastName.error}
          helperText={customerError.lastName.helperText}
          required
        />
        <TextField
          variant="outlined"
          error={customerError.gender.error}
          select
          label="Gender"
          value={customerState.gender || ""}
          onChange={setField("gender")}
          helperText={customerError.gender.helperText}
          required
        >
          <MenuItem aria-label="None" value="" />
          <MenuItem key={"M"} value={"M"}>
            male
          </MenuItem>
          <MenuItem key={"F"} value={"F"}>
            female
          </MenuItem>
        </TextField>

        <TextField
          label="Email"
          variant="outlined"
          value={customerState.email || ""}
          onChange={setField("email")}
          error={customerError.email.error}
          helperText={customerError.email.helperText}
        />
        <TextField
          label="Phone"
          variant="outlined"
          value={customerState.phone || ""}
          onChange={setField("phone")}
          error={customerError.phone.error}
          helperText={customerError.phone.helperText}
        />
        <TextField
          label="Birthday"
          variant="outlined"
          value={customerState.birthday || ""}
          onChange={setField("birthday")}
          InputLabelProps={{
            shrink: true,
          }}
          error={customerError.birthday.error}
          helperText={customerError.birthday.helperText}
          placeholder="YYYY-MM-DD"
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
      </div>
      <h5 style={{ marginTop: "50px" }}>Relationships</h5>
      <Relationships
        relationships={customerState.relationships || []}
        updateRelationships={(relationships) =>
          setCustomerState((prev) => ({ ...prev, relationships }))
        }
        menuItems={menuItems}
      />
      <Notes
        notes={customerState.notes || {}}
        updateNotes={(notes) => setCustomerState((prev) => ({ ...prev, notes: notes }))}
      />
      <h5 style={{ marginTop: "50px" }}>Related Policies</h5>
      <List component="nav" className={classes.root}>
        {policyItem(policyAsOwner, "Owner of Policy/Policies: ")}
        {policyItem(policyAsInsurer, "Insurer of Policy/Policies: ")}
        {policyItem(policyAsContact, "Contact Person of Policy/Policies: ")}
      </List>

      <div>
        <Backdrop className={classes.backdrop} open={customers.isUpdatingCustomer}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <div className={classes.ButtonRoot}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            if (validate()) {
              if (customerState.relationships) {
                customerState.relationships = Lodash.filter(
                  customerState.relationships,
                  (relationship) => {
                    return relationship.value !== "" && relationship.name !== "";
                  }
                );
              }
              let filteredNote = {};
              if (customerState.notes) {
                for (let [key, value] of Object.entries(customerState.notes)) {
                  if (value !== "") {
                    filteredNote[key] = value;
                  }
                }
              }
              setCustomerState((prev) => ({ ...prev, notes: filteredNote }));
              updateCustomer(customerState, userToken);
            }
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            if (validateDelete()) {
              removeCustomer(customerId, userToken);
            } else {
              alert(
                "Cannot delete the current user since we still have policies or users connected to this user."
              );
            }
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
    userToken: state.sessions.userToken,
    customers: state.customers,
    customerId: ownProps.match.params.customer_id,
    policies: state.policies.data,
  };
}

const actionCreators = {
  updateCustomer: actions.updateCustomer,
  removeCustomer: actions.removeCustomer,
};

const ConnectedCustomerDetailPage = connect(mapState, actionCreators)(CustomerDetailPage);

export default ConnectedCustomerDetailPage;
