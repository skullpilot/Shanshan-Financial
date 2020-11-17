import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CakeIcon from "@material-ui/icons/Cake";
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
import moment from 'moment';
import IconButton from "@material-ui/core/IconButton";
import { actions } from "../redux/actions";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
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

function BirthdayTemplates({ attachments, createAttachment, deleteAttachment, userToken }) {
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    deleteAttachment(attachment.fileName, userToken)
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

  // TODO: @maria improve birthday logic here.
  const customersWithBirthday = customers.filter((cx) => {
    return cx.birthday && moment(cx.birthday).month() >= (new moment().month())
  });

  customersWithBirthday.sort((a, b) => {
    const aM = moment(a.birthday)
    const bM = moment(b.birthday)

    const monthDiff = aM.month() - bM.month();
    if (monthDiff !== 0) {
      return monthDiff
    }

    return aM.date() - bM.date()
  })

  return (
    <div>
      <ConnectedBirthdayTemplates />
      <Divider />
      <Timeline>
        {customersWithBirthday.map((cx) => (
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography variant="body2" color="textSecondary">
                {cx.birthday}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <CakeIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  {`${cx.firstName}, ${cx.lastName}`}
                </Typography>
                <Typography>{`Birthday: ${cx.birthday || "unknown"}`}</Typography>
                <Typography>{`Email: ${cx.email || "unknown"}, Phone: ${cx.phone || "unknown"}`}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
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
