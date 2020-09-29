import React from "react";
import { Provider, connect } from "react-redux";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import { history } from "./history";
import { store } from "./redux/store";
import { actions } from "./redux/actions";
import { PolicyDetailPage, PolicyListPage } from "./policy";
import { CustomerDetailPage, CustomerListPage } from "./customer";
import { BirthdayListPage } from "./birthday";
import HomePage from "./homepage";

function PrivateApp({ customers, fetchCustomers }) {
  if (!customers.isInitialized) {
    fetchCustomers(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNzZiIsImlhdCI6MTYwMDc0ODcxNiwiZXhwIjoxNjAzMzQwNzE2fQ.1cpvPyQv6fT3qeP2FvuTRUQ4KkkO7pI_atw-KqeGzuo"
    );
    return <div>Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/customers">
        <CustomerListPage />
      </Route>
      <Route path="/policies">
        <PolicyListPage />
      </Route>
      <Route
        path="/customer/:customer_id"
        render={(props) => <CustomerDetailPage {...props} />}
      />
      <Route
        path="/policy/:policy_id"
        render={(props) => <PolicyDetailPage {...props} />}
      />
      <Route path="/birthdays">
        <BirthdayListPage />
      </Route>
    </Switch>
  );
}

function mapState(state) {
  return {
    customers: state.customers,
  };
}

const actionCreators = {
  fetchCustomers: actions.fetchCustomers,
};

const ConnectedPrivateApp = connect(
  mapState,
  actionCreators
)(PrivateApp);

// TODO: deal with non existing page/route
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
