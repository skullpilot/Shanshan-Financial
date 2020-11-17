import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { actions } from "../redux/actions";
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

function PolicyDetailPage({ policy, policies, customers, userToken, updatePolicy, removePolicy }) {
  const classes = useStyles();
  const [policyState, setpolicyState] = useState(policy);
  const [policyError, setPolicyError] = useState({
    applicationDate: { helperText: "", error: false },
    policyDate: { helperText: "", error: false },
    insurerId: { helperText: "", error: false },
    ownerId: { helperText: "", error: false },
  });

  if (!policy) {
    return <div>Can't find the policy information</div>;
  }

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
    setpolicyState((prevState) => ({ ...prevState, [field]: value }));
  });

  const validate = () => {
    let isValid = true;

    if (!policyState.insurerId) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        insurerId: { helperText: "Please select an insurer", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        insurerId: { helperText: "", error: false },
      }));
    }
    if (
      policyState.applicationDate &&
      !Validator.isDate(policyState.applicationDate, "YYYY-MM-DD")
    ) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        applicationDate: {
          helperText: "Please provide a valid policy application date in format YYYY-MM-DD",
          error: true,
        },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        applicationDate: { helperText: "", error: false },
      }));
    }

    if (policyState.policyDate && !Validator.isDate(policyState.policyDate, "YYYY-MM-DD")) {
      isValid = false;
      setPolicyError((prevState) => ({
        ...prevState,
        policyDate: {
          helperText: "Please provide a valid policy start date in format YYYY-MM-DD",
          error: true,
        },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        policyDate: { helperText: "", error: false },
      }));
    }
    if (!policyState.ownerId) {
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
      <h3>Insurer Information</h3>
      <div>
        <FormControl className={classes.formControl} error={policyError.insurerId.error}>
          <InputLabel id="insurerId-label">Insurer</InputLabel>
          <Select
            labelId="insurerId-label"
            value={policyState.insurerId || ""}
            onChange={setField("insurerId")}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.insurerId.helperText}</FormHelperText>
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
          value={policyState.policyNumber || "none"}
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
          error={policyError.applicationDate.error}
          helperText={policyError.applicationDate.helperText}
          placeholder="YYYY-MM-DD"
        />
        <TextField
          label="Policy Date"
          variant="outlined"
          value={policyState.policyDate}
          onChange={setField("policyDate")}
          error={policyError.policyDate.error}
          helperText={policyError.policyDate.helperText}
          placeholder="YYYY-MM-DD"
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
          label="Beneficaries"
          variant="outlined"
          value={policy.beneficaries || ""}
          onChange={setField("beneficaries")}
        />
        <TextField
          label="Beneficaries Relation"
          variant="outlined"
          value={policy.beneficariesRelation || ""}
          onChange={setField("beneficariesRelation")}
        />
        <div className={classes.note}>
          <TextField
            label="Notes"
            variant="outlined"
            rows={6}
            multiline
            value={policyState.notes}
            onChange={setField("notes")}
          />
        </div>
      </div>

      <h3>Owner Information</h3>
      <div>
        <FormControl className={classes.formControl} error={policyError.ownerId.error}>
          <InputLabel id="ownerId-label">Owner</InputLabel>
          <Select
            labelId="ownerId-label"
            value={policyState.ownerId || ""}
            onChange={setField("ownerId")}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.ownerId.helperText}</FormHelperText>
        </FormControl>
      </div>
      <div>
        <Backdrop className={classes.backdrop} open={policies.isUpdatingPolicy}>
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
              updatePolicy(policyState, userToken);
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
    policies: state.policies,
    customers: state.customers,
    userToken: state.sessions.userToken,
  };
}

const actionCreators = {
  updatePolicy: actions.updatePolicy,
  removePolicy: actions.removePolicy,
};

const ConnectedPolicyDetailPage = connect(mapState, actionCreators)(PolicyDetailPage);

export default ConnectedPolicyDetailPage;
