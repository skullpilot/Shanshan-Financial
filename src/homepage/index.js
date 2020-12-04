import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import * as Lodash from "lodash";
import { actions } from "../redux/actions";

//TODO: move input form in the center
const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(3),
    backgroundImage: "url(https://www.itl.cat/pngfile/big/34-349100_westworld-logo-tv-series-hbo-wallpaper-and-background.jpg)",
    backgroundPosition: "center",         
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  block: {
    backgroundColor: 'white',
    width: '35vw',
    height: '40vh',
    boxShadow: "3px 3px 1px grey",
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    padding: theme.spacing(1),
    width: '55%',
  },
  buttonStyle: {
    padding: theme.spacing(1),
    width: '55%',
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
    <div className={classes.page}>
      <div className={classes.block}>
        <div className={classes.inputBox}>
          <TextField 
          fullWidth
          label="Email" name="email" 
          size="small" 
          variant="outlined" 
          onChange={setField("username")}
          />
        </div>

        <div className={classes.inputBox}>
          <TextField 
          fullWidth 
          label="Password" 
          name="password" 
          size="small" 
          type="password" 
          variant="outlined" 
          onChange={setField("password")}
          />
        </div>

        <div className={classes.buttonStyle}>
          <Button 
          color="secondary" 
          fullWidth
          type="submit"
          variant="contained" 
          onClick={() => login()}>
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
}

const actionCreators = {
  createSession: actions.createSession,
};

const ConnectedHomePage = connect(null, actionCreators)(HomePage);

export default ConnectedHomePage;