import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { actions } from "../redux/actions";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AttachmentIcon from "@material-ui/icons/Attachment";

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
  AttachementsRoot: {
    "& .MuiAvatar-root": {
      width: "30px",
      height: "30px",
    },
    "& .MuiListItemAvatar-root": {
      minWidth: "40px",
    },
    display: "flex",
    justifyContent: "center",
  },
}));

function CustomerDetailPage({ customer, updateCustomer, removeCustomer }) {
  const classes = useStyles();
  const [customerState, setCustomerState] = useState(customer);

  if (!customer) {
    return <div>Can't find the customer information</div>;
  }

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomerState((prevState) => ({ ...prevState, [field]: value }));
  });

  return (
    <div className={classes.TextFieldRoot}>
      <div>
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
      </div>
      <h5>Attachments: </h5>
      <div className={classes.AttachementsRoot}>
        <List>
          {customerState.attachments &&
            customerState.attachments.map((attachment) => (
              <ListItem button onClick={() => document.getElementById(attachment.fileName).click() }>
                <ListItemAvatar>
                  <Avatar>
                    <AttachmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText secondary={attachment.fileName} />
                <a id={attachment.fileName} href={attachment.url} download hidden></a>
              </ListItem>
            ))}
        </List>
      </div>
      <div className={classes.ButtonRoot}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
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
          style={{ marginTop: "100px", marginBottom: "200px" }}
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
  removeCustomer: actions.removeCustomer,
};

const ConnectedCustomerDetailPage = connect(
  mapState,
  actionCreators
)(CustomerDetailPage);

export default ConnectedCustomerDetailPage;