import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import { actions } from "../redux/actions";

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
  }
}));

function PolicyDetailPage({ policy, customers, userToken, updatePolicy, removePolicy }) {
  const classes = useStyles();
  const [policyState, setpolicyState] = useState(policy);

  if (!policy) {
    return <div>Can't find the policy information</div>;
  }

  const createMenuItems = () => {
    return Object.values(customers.data).map(customer => <MenuItem value={customer.id} key={customer.id}>{`${customer.firstName}, ${customer.lastName}`}</MenuItem>);
  }

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setpolicyState((prevState) => ({ ...prevState, [field]: value }));
  });

  return (
    <div className={classes.TextFieldRoot}>
      <h3>Insurer Information</h3>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="insurerId-label">Insurer</InputLabel>
          <Select
            labelId="insurerId-label"
            value={policyState.insurerId || ""}
            onChange={setField("insurerId")}
          >
            {createMenuItems()}
          </Select>
        </FormControl>
      </div>

      <h3>Policy Information</h3>
      <div>
        <TextField
          label="Company"
          variant="outlined"
          value={policyState.company || ""}
          onChange={setField("company")}
        />
        <TextField
          label="Policy Number"
          variant="outlined"
          value={policyState.policyNumber}
          onChange={setField("policyNumber")}
        />
        <TextField
          label="Plan"
          variant="outlined"
          value={policyState.plan}
          onChange={setField("plan")}
        />
        <TextField
          label="Face Amount"
          variant="outlined"
          value={policyState.faceAmount}
          onChange={setField("faceAmount")}
        />
        <TextField
          label="Application Date"
          variant="outlined"
          value={policyState.applicationDate}
          onChange={setField("applicationDate")}
        />
        <TextField
          label="Policy Date"
          variant="outlined"
          value={policyState.policyDate}
          onChange={setField("policyDate")}
        />
        <TextField
          label="Ride"
          variant="outlined"
          value={policyState.ride}
          onChange={setField("ride")}
        />
        <TextField
          label="Rate"
          variant="outlined"
          value={policyState.rate}
          onChange={setField("rate")}
        />
        <TextField
          label="Frequency"
          variant="outlined"
          value={policyState.frequency}
          onChange={setField("frequency")}
        />
        <TextField
          label="Premium"
          variant="outlined"
          value={policyState.premium}
          onChange={setField("premium")}
        />
        <TextField
          label="Period"
          variant="outlined"
          value={policyState.period}
          onChange={setField("period")}
        />
        <TextField
          label="Status"
          variant="outlined"
          value={policyState.status}
          onChange={setField("status")}
        />
        <TextField
          label="Notes"
          variant="outlined"
          value={policyState.notes}
          onChange={setField("notes")}
        />
      </div>

      <h3>Owner Information</h3>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="ownerId-label">Owner</InputLabel>
          <Select
            labelId="ownerId-label"
            value={policyState.ownerId || ""}
            onChange={setField("ownerId")}
          >
            {createMenuItems()}
          </Select>
        </FormControl>
      </div>

      <div className={classes.ButtonRoot}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            updatePolicy(policyState, userToken);
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            removePolicy(policy.id, userToken);
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

function mapState(state, ownProps) {
  const policy = state.policies.data[ownProps.match.params.policy_id];

  return {
    policy,
    customers: state.customers,
    userToken: state.sessions.userToken,
  };
}

const actionCreators = {
  updatePolicy: actions.updatePolicy,
  removePolicy: actions.removePolicy,
};

const ConnectedPolicyDetailPage = connect(
  mapState,
  actionCreators
)(PolicyDetailPage);

export default ConnectedPolicyDetailPage;
