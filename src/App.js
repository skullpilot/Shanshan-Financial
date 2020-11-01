import React from "react";
import { Provider, connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ArrowBack from "@material-ui/icons/ArrowBack";

import { history } from "./history";
import { store } from "./redux/store";
import { actions } from "./redux/actions";
import { PolicyDetailPage, PolicyListPage, CreatePolicyPage } from "./policy";
import {
  CustomerDetailPage,
  CustomerListPage,
  CreateCustomerPage,
} from "./customer";
import { BirthdayListPage } from "./birthday";
import HomePage from "./homepage";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function AppTopBar({ title, needReturn = false, deleteSession }) {
  const classes = useStyles();

  const content = needReturn ? (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="back"
        onClick={() => history.goBack()}
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        Back
      </Typography>
      <Button color="inherit" onClick={() => deleteSession()}>
        Logout
      </Button>
    </Toolbar>
  ) : (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
      >
        <HomeIcon />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <Button color="inherit" onClick={() => history.push("/customers")}>
        <u>Customers</u>
      </Button>
      <Button color="inherit" onClick={() => history.push("/policies")}>
        <u>Policies</u>
      </Button>
      <Button color="inherit" onClick={() => history.push("/birthdays")}>
        <u>Birthdays</u>
      </Button>
      <Button color="inherit" onClick={() => deleteSession()}>
        Logout
      </Button>
    </Toolbar>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">{content}</AppBar>
    </div>
  );
}

const ConnectedAppTopBar = connect(null, {
  deleteSession: actions.deleteSession,
})(AppTopBar);

function PrivateApp({ customers, fetchCustomers, policies, fetchPolicies, userToken }) {
  // TODO: remove default token (@Vincent)
  const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwMDc0ODcxNiwiZXhwIjoxNjAzMzQwNzE2fQ.1cpvPyQv6fT3qeP2FvuTRUQ4KkkO7pI_atw-KqeGzuo";
  if (!customers.isInitialized) {
    fetchCustomers(userToken || defaultToken);
    return <div>Loading...</div>;
  }

  if (!policies.isInitialized) {
    fetchPolicies(userToken || defaultToken);
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Switch>
        <Route path="/customers">
          <ConnectedAppTopBar title="珊珊财富 - 用户列表" />
          <CustomerListPage />
        </Route>
        <Route path="/policies">
          <ConnectedAppTopBar title="珊珊财富 - 保单列表" />
          <PolicyListPage />
        </Route>
        <Route
          path="/customer/:customer_id"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <CustomerDetailPage {...props} />
            </div>
          )}
        />
        <Route
          path="/customer"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <CreateCustomerPage {...props} />
            </div>
          )}
        />
        <Route
          path="/policy/:policy_id"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <PolicyDetailPage {...props} />
            </div>
          )}
        />
        <Route
          path="/policy"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <CreatePolicyPage {...props} />
            </div>
          )}
        />
        <Route
          path="/birthdays"
          render={(props) => (
            <div>
              <ConnectedAppTopBar title="珊珊财富 - 生日列表" />
              <BirthdayListPage {...props} />
            </div>
          )}
        ></Route>
      </Switch>
    </div>
  );
}

function mapState(state) {
  return {
    customers: state.customers,
    policies: state.policies,
    userToken: state.sessions.userToken,
  };
}

const actionCreators = {
  fetchCustomers: actions.fetchCustomers,
  fetchPolicies: actions.fetchPolicies,
};

const ConnectedPrivateApp = connect(mapState, actionCreators)(PrivateApp);

// TODO: deal with non existing page/route (@maria)
function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route>
            <ConnectedPrivateApp />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );
}

export default App;
