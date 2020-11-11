import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";

import { actions } from "../redux/actions";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

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
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
}));

function CreatePolicyPage({ createPolicy, customers, policies, userToken }) {
  const classes = useStyles();
  const [policy, setPolicy] = useState({});
  const [policyError, setPolicyError] = useState({
    name: { helperText: "", error: false },
    company: { helperText: "", error: false },
    policyNumber: { helperText: "", error: false },
    plan: { helperText: "", error: false },
    faceAmount: { helperText: "", error: false },
    applicationDate: { helperText: "", error: false },
    policyDate: { helperText: "", error: false },
  });
  const createMenuItems = () => {
    return Object.values(customers.data).map((customer) => (
      <MenuItem
        value={customer.id}
        key={customer.id}
      >{`${customer.firstName}, ${customer.lastName}`}</MenuItem>
    ));
  };
  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setPolicy((prevState) => ({ ...prevState, [field]: value }));
  });

  const validate = () => {
    let isValid = true;

    if (!policy.name) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        name: { helperText: "Please provide policy name", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        name: { helperText: "", error: false },
      }));
    }

    if (!policy.company) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        company: { helperText: "Please provide policy company", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        company: { helperText: "", error: false },
      }));
    }

    if (!policy.policyNumber) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        policyNumber: { helperText: "Please provide policy number", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        policyNumber: { helperText: "", error: false },
      }));
    }

    if (!policy.plan) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        plan: { helperText: "Please provide policy plan", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        plan: { helperText: "", error: false },
      }));
    }

    if (!policy.faceAmount) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        faceAmount: { helperText: "Please provide policy face amount", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        faceAmount: { helperText: "", error: false },
      }));
    }

    if (!policy.applicationDate) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        applicationDate: { helperText: "Please provide policy application date", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        applicationDate: { helperText: "", error: false },
      }));
    }

    if (!policy.policyDate) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        policyDate: { helperText: "Please provide policy date", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        policyDate: { helperText: "", error: false },
      }));
    }

    return isValid;
  };

  return (
    <div className={classes.TextFieldRoot}>
      <h3>Insurer Information</h3>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="insurerId-label">Insurer</InputLabel>
          <Select
            labelId="insurerId-label"
            value={policy.insurerId || ""}
            onChange={setField("insurerId")}
          >
            {createMenuItems()}
          </Select>
        </FormControl>

        <TextField label="Name" value={policy.name || ""} onChange={setField("name")} required />
      </div>

      <h3>Policy Information</h3>
      <div>
        <TextField
          label="Company"
          variant="outlined"
          value={policy.company || ""}
          onChange={setField("company")}
          required
        />
        <TextField
          label="Policy Number"
          variant="outlined"
          value={policy.policyNumber || ""}
          onChange={setField("policyNumber")}
          required
        />
        <TextField
          label="Plan"
          variant="outlined"
          value={policy.plan || ""}
          onChange={setField("plan")}
          required
        />
        <TextField
          label="Face Amount"
          variant="outlined"
          value={policy.faceAmount || ""}
          onChange={setField("faceAmount")}
          required
        />
        <TextField
          type="date"
          label="Application Date"
          variant="outlined"
          value={policy.applicationDate || ""}
          onChange={setField("applicationDate")}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          type="date"
          label="Policy Date"
          variant="outlined"
          value={policy.policyDate || ""}
          onChange={setField("policyDate")}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          label="Ride"
          variant="outlined"
          value={policy.ride || ""}
          onChange={setField("ride")}
        />
        <TextField
          label="Rate"
          variant="outlined"
          value={policy.rate || ""}
          onChange={setField("rate")}
        />
        <TextField
          label="Frequency"
          variant="outlined"
          value={policy.frequency || ""}
          onChange={setField("frequency")}
        />
        <TextField
          label="Premium"
          variant="outlined"
          value={policy.premium || ""}
          onChange={setField("premium")}
        />
        <TextField
          label="Period"
          variant="outlined"
          value={policy.period || ""}
          onChange={setField("period")}
        />
        <TextField
          label="Status"
          variant="outlined"
          value={policy.status || ""}
          onChange={setField("status")}
        />
        <TextField
          label="Notes"
          variant="outlined"
          value={policy.notes || ""}
          onChange={setField("notes")}
        />
      </div>
      <div>
        <Backdrop className={classes.backdrop} open={policies.isCreatingPolicy}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <h3>Owner Information</h3>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="ownerId-label">Insurer</InputLabel>
          <Select
            labelId="ownerId-label"
            value={policy.ownerId || ""}
            onChange={setField("ownerId")}
          >
            {createMenuItems()}
          </Select>
        </FormControl>

        <TextField disabled label="Owner Name" variant="outlined" value={""} />
      </div>

      <div className={classes.ButtonRoot}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            if (validate()) {
              createPolicy(policy, userToken);
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

function mapState(state) {
  return {
    customers: state.customers,
    userToken: state.sessions.userToken,
    policies: state.policies,
  };
}

const actionCreators = {
  createPolicy: actions.createPolicy,
};

const ConnectedCreatePolicyPage = connect(mapState, actionCreators)(CreatePolicyPage);

export default ConnectedCreatePolicyPage;
