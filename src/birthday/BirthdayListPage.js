import React from "react";
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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function BirthdayListPage({ customers }) {
  const classes = useStyles();

  const customersWithFollowupDate = customers.filter((cx) => cx.followUpDate);

  // TODO: sort only based on birthday month and day, and only checking for upcoming month
  // for date compare, one could use moment(https://momentjs.com/)

  return (
    <Timeline align="alternate">
      {customersWithFollowupDate.map((cx) => (
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              {cx.followUpDate}
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
              <Typography>{`Email: ${cx.email}, Phone: ${cx.phone}`}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
  };
}

const ConnectedBirthdayListPage = connect(mapState)(BirthdayListPage);

export default ConnectedBirthdayListPage;
