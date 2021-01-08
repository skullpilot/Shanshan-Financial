import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";

import { actions } from "../redux/actions";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { history } from "../history";
import IconButton from "@material-ui/core/IconButton";
import ContactsIcon from "@material-ui/icons/Contacts";
import FormHelperText from "@material-ui/core/FormHelperText";
import Validator from "validator";

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
  note: {
    [theme.breakpoints.up("md")]: {
      "& .MuiTextField-root": {
        position: "relative",
        width: "50%",
      },
    },
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
    insuredId: { helperText: "", error: false },
    ownerId: { helperText: "", error: false },
    contactId: { helperText: "", error: false },
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

    if (!policy.contactId) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        contactId: {
          helperText: "Please select an contact person",
          error: true,
        },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        contactId: { helperText: "", error: false },
      }));
    }

    if (!policy.insuredId) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        insuredId: { helperText: "Please select a person to be insured", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        insuredId: { helperText: "", error: false },
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
        policyNumber: {
          helperText: "Please provide policy number",
          error: true,
        },
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
        faceAmount: {
          helperText: "Please provide policy face amount",
          error: true,
        },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        faceAmount: { helperText: "", error: false },
      }));
    }

    if (
      !policy.applicationDate ||
      !Validator.isDate(policy.applicationDate, "YYYY-MM-DD")
    ) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        applicationDate: {
          helperText:
            "Please provide a valid policy application date in format YYYY-MM-DD",
          error: true,
        },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        applicationDate: { helperText: "", error: false },
      }));
    }
    if (
      policy.policyDate &&
      !Validator.isDate(policy.policyDate, "YYYY-MM-DD")
    ) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        policyDate: {
          helperText:
            "Please provide a valid policy start date in format YYYY-MM-DD",
          error: true,
        },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        policyDate: { helperText: "", error: false },
      }));
    }

    if (!policy.ownerId) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        ownerId: { helperText: "Please select an owner", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        ownerId: { helperText: "", error: false },
      }));
    }

    return isValid;
  };

  return (
    <div className={classes.TextFieldRoot}>
      <h3>Contact Information</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormControl
          className={classes.formControl}
          error={policyError.contactId.error}
        >
          <InputLabel id="contactId-label">Contact Person</InputLabel>
          <Select
            labelId="contactId-label"
            value={policy.contactId || ""}
            onChange={setField("contactId")}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.contactId.helperText}</FormHelperText>
        </FormControl>
        <IconButton aria-label="info">
          <ContactsIcon
            fontSize="inherit"
            onClick={() => history.push(`/customer/${policy.contactId}`)}
          />
        </IconButton>
      </div>

      <h3>Insured Information</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormControl
          className={classes.formControl}
          error={policyError.insuredId.error}
        >
          <InputLabel id="insuredId-label">Insured</InputLabel>
          <Select
            labelId="insuredId-label"
            value={policy.insuredId || ""}
            onChange={setField("insuredId")}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.insuredId.helperText}</FormHelperText>
        </FormControl>
        <IconButton aria-label="info">
          <ContactsIcon
            fontSize="inherit"
            onClick={() => history.push(`/customer/${policy.insuredId}`)}
          />
        </IconButton>
      </div>

      <h3>Policy Information</h3>
      <div>
        <TextField
          label="Company"
          variant="outlined"
          value={policy.company || ""}
          onChange={setField("company")}
          error={policyError.company.error}
          helperText={policyError.company.helperText}
          required
        />
        <TextField
          label="Policy Number"
          variant="outlined"
          value={policy.policyNumber || "none"}
          onChange={setField("policyNumber")}
          error={policyError.policyNumber.error}
          helperText={policyError.policyNumber.helperText}
          required
        />
        <TextField
          label="Plan"
          variant="outlined"
          value={policy.plan || ""}
          onChange={setField("plan")}
          error={policyError.plan.error}
          helperText={policyError.plan.helperText}
          required
        />
        <TextField
          label="Face Amount"
          variant="outlined"
          value={policy.faceAmount || ""}
          onChange={setField("faceAmount")}
          error={policyError.faceAmount.error}
          helperText={policyError.faceAmount.helperText}
          required
        />
        <TextField
          label="Application Date"
          variant="outlined"
          value={policy.applicationDate || ""}
          onChange={setField("applicationDate")}
          error={policyError.applicationDate.error}
          helperText={policyError.applicationDate.helperText}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="YYYY-MM-DD"
          required
        />
        <TextField
          label="Policy Date"
          variant="outlined"
          value={policy.policyDate || ""}
          onChange={setField("policyDate")}
          error={policyError.policyDate.error}
          helperText={policyError.policyDate.helperText}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="YYYY-MM-DD"
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
          label="Beneficiaries"
          variant="outlined"
          value={policy.beneficiaries || ""}
          onChange={setField("beneficiaries")}
        />
        <TextField
          label="Beneficiaries Relation"
          variant="outlined"
          value={policy.beneficiariesRelation || ""}
          onChange={setField("beneficiariesRelation")}
        />
        <div className={classes.note}>
          <TextField
            label="Notes"
            variant="outlined"
            rows={6}
            multiline
            value={policy.notes || ""}
            onChange={setField("notes")}
          />
        </div>
      </div>
      <div>
        <Backdrop className={classes.backdrop} open={policies.isCreatingPolicy}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <h3>Owner Information</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormControl
          className={classes.formControl}
          error={policyError.ownerId.error}
        >
          <InputLabel id="ownerId-label">Owner</InputLabel>
          <Select
            labelId="ownerId-label"
            value={policy.ownerId || ""}
            onChange={setField("ownerId")}
            error={policyError.ownerId.error}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.ownerId.helperText}</FormHelperText>
        </FormControl>
        <IconButton aria-label="info">
          <ContactsIcon
            fontSize="inherit"
            onClick={() => history.push(`/customer/${policy.ownerId}`)}
          />
        </IconButton>
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

const ConnectedCreatePolicyPage = connect(
  mapState,
  actionCreators
)(CreatePolicyPage);

export default ConnectedCreatePolicyPage;
