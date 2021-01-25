import React from "react";
import { Provider, connect } from "react-redux";
import { Router, Route, Switch, Redirect } from "react-router-dom";

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
import NotFound from "./errorpage";
import HomePage from "./homepage";

function AppTopBar({needReturn = false, deleteSession }) {
  const content = needReturn ? (
    <div className="flex flex-row justify-between my-8 mx-8">
      <div
        className="cursor-pointer text-large text-grey-dark"
        onClick={() => history.goBack()}
      >
        Back
      </div>
      <div
        onClick={() => deleteSession()}
        className="cursor-pointer text-large"
      >
        Logout
      </div>
    </div>
  ) : (
      <div className="flex flex-row justify-between my-8 mx-8">
        <div className="flex flex-row">
          <div
            className="mr-8 cursor-pointer text-xlarge text-grey-dark hover:text-black"
            onClick={() => history.push("/customers")}
          >
            <u>Customers</u>
          </div>
          <div
            className="mr-8 cursor-pointer text-xlarge text-grey-dark hover:text-black"
            onClick={() => history.push("/policies")}
          >
            <u>Policies</u>
          </div>
          <div
            className="mr-8 cursor-pointer text-xlarge text-grey-dark hover:text-black"
            onClick={() => history.push("/birthdays")}
          >
            <u>Birthdays</u>
          </div>
        </div>

        <div
          onClick={() => deleteSession()}
          className="cursor-pointer text-xlarge"
        >
          Logout
        </div>
      </div>
    
  );

  return content;
}

const ConnectedAppTopBar = connect(null, {
  deleteSession: actions.deleteSession,
})(AppTopBar);

function PrivateApp({ initialization, initialize, userToken }) {
  if (userToken === null) {
    return <Redirect to="/" />;
  }

  if (initialization.status === "loading") {
    return (
      <div className="h-screen w-sreen flex flex-col justify-center items-center">
        <h1>Loading, please wait...</h1>
      </div>
    );
  }

  if (initialization.status === "none") {
    initialize(userToken);
    return (
      <div className="h-screen w-sreen flex flex-col justify-center items-center">
        <h1>Loading, please wait...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Switch>
        <Route exact path="/customers">
          <ConnectedAppTopBar/>
          <CustomerListPage/>
        </Route>
        <Route exact path="/policies">
          <ConnectedAppTopBar/>
          <PolicyListPage />
        </Route>
        <Route
          exact
          path="/customer/:customer_id"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <CustomerDetailPage {...props} />
            </div>
          )}
        />
        <Route
          exact
          path="/customer"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <CreateCustomerPage {...props} />
            </div>
          )}
        />
        <Route
          exact
          path="/policy/:policy_id"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <PolicyDetailPage {...props} />
            </div>
          )}
        />
        <Route
          exact
          path="/policy"
          render={(props) => (
            <div>
              <ConnectedAppTopBar needReturn={true} />
              <CreatePolicyPage {...props} />
            </div>
          )}
        />
        <Route
          exact
          path="/birthdays"
          render={(props) => (
            <div>
              <ConnectedAppTopBar title="珊珊财富 - 生日列表" />
              <BirthdayListPage {...props} />
            </div>
          )}
        ></Route>
        <Route path="/404" component={NotFound} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}

function mapState(state) {
  return {
    userToken: state.sessions.userToken,
    initialization: state.initialization,
  };
}

const actionCreators = {
  initialize: actions.initialize,
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
