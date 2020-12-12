import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AttachmentIcon from "@material-ui/icons/Attachment";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import { actions } from "../redux/actions";
import { history } from "../history";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
    width: "380px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  AttachmentsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  AttachmentsRoot: {
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
    color: "#fff",
  },
}));

function BirthdayTemplates({
  attachments,
  createAttachment,
  deleteAttachment,
  userToken,
}) {
  const classes = useStyles();
  const [file, setFile] = useState(null);

  const handleFileUpload = async () => {
    if (!file) {
      return;
    }
    createAttachment(file, userToken);
  };

  return (
    <div className={classes.AttachmentsContainer}>
      <Backdrop className={classes.backdrop} open={attachments.requesting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <h5>Birthday Attachments: </h5>
      <div className={classes.AttachmentsRoot}>
        <List>
          {attachments.data &&
            attachments.data.map((attachment) => (
              <div
                key={attachment.fileName}
                style={{ display: "flex", alignItems: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    deleteAttachment(attachment.fileName, userToken);
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
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
              </div>
            ))}
        </List>
      </div>
      <h5>Selected File To Upload: {file && file.name}</h5>
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
    </div>
  );
}

const ConnectedBirthdayTemplates = connect(
  (state) => {
    return {
      attachments: state.attachments,
      userToken: state.sessions.userToken,
    };
  },
  {
    createAttachment: actions.createAttachment,
    deleteAttachment: actions.deleteAttachment,
  }
)(BirthdayTemplates);

function BirthdayListPage({ customers }) {
  const classes = useStyles();

  function sortDate(a, b) {
    const A = Math.abs(moment(a).subtract(moment(a).year(), "years"));
    const B = Math.abs(moment(b).subtract(moment(b).year(), "years"));
    return B - A;
  }

  function sortBirthday() {
    let currYear = [];
    let nextYear = [];
    let date = new Date();
    date.setDate(date.getDate() - 1);

    customers.map((customer) => {
      if (customer.birthday) {
        if (sortDate(customer.birthday, date) > 0) {
          currYear.push(customer);
        } else {
          nextYear.push(customer);
        }
      }
    });
    currYear.sort((a, b) => sortDate(a.birthday, b.birthday));
    nextYear.sort((a, b) => sortDate(a.birthday, b.birthday));
    return currYear.concat(nextYear);
  }

  const customersWithBirthday = sortBirthday();

  return (
    <div>
      <ConnectedBirthdayTemplates />
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {customersWithBirthday.map((cx) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "8px",
            }}
          >
            <div>
              <Typography variant="h3" color="textSecondary">
                {moment(cx.birthday).format("MM-DD")}
              </Typography>
            </div>
            <div style={{ width: "35px" }} />
            <div>
              <Paper elevation={3} className={classes.paper}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" component="h1">
                    {`${cx.firstName}, ${cx.lastName}`}
                  </Typography>
                  <Button
                    onClick={() => {
                      history.push(`/customer/${cx.id}`);
                    }}
                    //style={{ backgroundColor: "lightGrey" }}
                  >
                    Customer Info
                  </Button>
                </div>
                <Typography>{`Birthday: ${
                  cx.birthday || "unknown"
                }`}</Typography>
                <Typography>{`Phone: ${cx.phone || "unknown"}`}</Typography>
                <Typography>{`Email: ${cx.email || "unknown"}`}</Typography>
              </Paper>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
  };
}

const ConnectedBirthdayListPage = connect(mapState)(BirthdayListPage);

export default ConnectedBirthdayListPage;
