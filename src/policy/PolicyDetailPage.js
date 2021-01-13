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
import { history } from "../history";
import IconButton from "@material-ui/core/IconButton";
import ContactsIcon from '@material-ui/icons/Contacts';
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
    insuredId: { helperText: "", error: false },
    ownerId: { helperText: "", error: false },
    contactId: { helperText: "", error: false },
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

    if (!policyState.contactId) {
      isValid = false;

      setPolicyError((prevState) => ({
        ...prevState,
        contactId: { helperText: "Please select an contact person", error: true },
      }));
    } else {
      setPolicyError((prevState) => ({
        ...prevState,
        contactId: { helperText: "", error: false },
      }));
    }

    if (!policyState.insuredId) {
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

      <h3>Contact Information</h3>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <FormControl className={classes.formControl} error={policyError.contactId.error}>
          <InputLabel id="contactId-label">Contact Person</InputLabel>
          <Select
            labelId="contactId-label"
            value={policyState.contactId || ""}
            onChange={setField("contactId")}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.contactId.helperText}</FormHelperText>
        </FormControl>
        <IconButton
          aria-label="info"
          onClick={() => history.push(`/customer/${policyState.contactId}`)} 
        >
          <ContactsIcon fontSize="inherit"/>
        </IconButton>
      </div>


      <h3>Insured Information</h3>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <FormControl className={classes.formControl} error={policyError.insuredId.error}>
          <InputLabel id="insuredId-label">Insured</InputLabel>
          <Select
            labelId="insuredId-label"
            value={policyState.insuredId || ""}
            onChange={setField("insuredId")}
          >
            {createMenuItems()}
          </Select>
          <FormHelperText>{policyError.insuredId.helperText}</FormHelperText>
        </FormControl>
        <IconButton
          aria-label="info"
        >
          <ContactsIcon fontSize="inherit" onClick={() => history.push(`/customer/${policyState.insuredId}`)} />
        </IconButton>
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
            value={policyState.notes}
            onChange={setField("notes")}
          />
        </div>
      </div>

      <h3>Owner Information</h3>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
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
        <IconButton
          aria-label="info"
        >
          <ContactsIcon fontSize="inherit" onClick={() => history.push(`/customer/${policyState.ownerId}`)} />
        </IconButton>
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
