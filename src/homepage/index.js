import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import * as Lodash from "lodash";

import { actions } from "../redux/actions";

//TODO: move input form in the center
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));

function HomePage({ createSession }) {
  const classes = useStyles();

  const [user, setUser] = useState({ username: "", password: "" });

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [field]: value }));
  });

  const login = () => {
    // TODO: better error message here
    if (!Lodash.isEmpty(user.username) && !Lodash.isEmpty(user.password)) {
      createSession(user.username, user.password);
    }
  };

  return (
    <Container className={classes.container} maxWidth="xs">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                size="small"
                variant="outlined"
                onChange={setField("username")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                size="small"
                type="password"
                variant="outlined"
                onChange={setField("password")}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="secondary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={() => login()}
          >
            Log in
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

const actionCreators = {
  createSession: actions.createSession,
};

const ConnectedHomePage = connect(null, actionCreators)(HomePage);

export default ConnectedHomePage;
