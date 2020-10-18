import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AttachmentIcon from "@material-ui/icons/Attachment";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { actions } from "../redux/actions";
import { SSF_API } from "../config";

// TODO: (@peter) this page will generate following warnings:
/*
Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwMDc0ODcxNiwiZXhwIjoxNjAzMzQwNzE2fQ.1cpvPyQv6fT3qeP2FvuTRUQ4KkkO7pI_atw-KqeGzuo";

function CustomerDetailPage({ customer, updateCustomer, removeCustomer }) {
  const classes = useStyles();
  const [customerState, setCustomerState] = useState(customer);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!customer) {
    return <div>Can't find the customer information</div>;
  }

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomerState((prevState) => ({ ...prevState, [field]: value }));
  });

  const handleFileUpload = async () => {
    if (!file) {
      return;
    }
    const [name, type] = file.name.split(".");
    const fileName = `client-${customer.id}-${name}.${type}`; // TODO: user id
    const fileType = type;
    setIsUploading(true);

    try {
      let response = await Axios.post(
        `${SSF_API}/attachment`,
        {
          fileName: fileName,
          fileType: fileType,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      const { signedRequest, url } = response.data.data.returnData;
  
      // TODO: need to verify if override and create behave similarily here(@peter)
      // I think if we need to implement delete, we only need to delete metadata in customer
      // no need to delete the actual file in S3, but this dependes the behavoir of S3 put api here
      response = await Axios.put(
        signedRequest,
        file,
        {
          headers: {
            "Content-Type": fileType,
          },
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
  
      const attachments = customerState.attachments
        ? customerState.attachments
        : [];
  
      // TODO: need to deal with duplicate files (@maria/@peter)
      const newFile = { url, fileName };
  
      attachments.push(newFile);
  
      response = await Axios.post(
        `${SSF_API}/customer/${customer.id}`,
        {
          ...customerState,
          attachments,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setCustomerState(prevState => ({...prevState, attachments}))
    } catch(err) {
      // TODO: better error handling here(@maria)
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={classes.TextFieldRoot}>
      <Backdrop className={classes.backdrop} open={isUploading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
              <ListItem
                button
                onClick={() =>
                  document.getElementById(attachment.fileName).click()
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <AttachmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText secondary={attachment.fileName} />
                <a
                  id={attachment.fileName}
                  href={attachment.url}
                  download
                  hidden
                ></a>
              </ListItem>
            ))}
        </List>
      </div>
      {/* TODO: better font here (@maria) */}
      <p>Selected File To Upload: {file && file.name}</p>
      <div>
        <label style={{ margin: "10px" }}>
          <input
            style={{ display: "none" }}
            type="file"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <Button
            color="default"
            variant="contained"
            component="span"
            startIcon={<AttachmentIcon />}
          >
            Choose File
          </Button>
        </label>
        <Button
          color="default"
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          style={{ margin: "10px" }}
          onClick={() => handleFileUpload()}
        >
          Upload File
        </Button>
      </div>
      <div className={classes.ButtonRoot}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            updateCustomer(customerState, token);
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "100px", marginBottom: "200px" }}
          onClick={() => {
            removeCustomer(customer.id, token);
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