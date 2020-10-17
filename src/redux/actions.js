import axios from "axios";
import { SSF_API } from "../config";
import { history } from "../history";

// TODO: add authentication
export const SESSION_REQUEST = "SESSION_REQUEST";
export const SESSION_SUCCESS = "SESSION_SUCCESS";
export const SESSION_FAILURE = "SESSION_FAILURE";
export const DELETE_SESSION = "DELETE_SESSION";

export const sessionConstants = {
  CREATE_SESSION: "CREATE_SESSION",
  CREATE_SESSION_SUCCESS: "CREATE_SESSION_SUCCESS",
  CREATE_SESSION_FAILURE: "CREATE_SESSION_FAILURE",
  DELETE_SESSION: "DELETE_SESSION"
}

export const customerConstants = {
  FETCH_CUSTOMERS_REQUEST_SUCCESS: "FETCH_CUSTOMERS_REQUEST_SUCCESS",
  CREATE_CUSTOMER_REQUEST_SUCCESS: "CREATE_CUSTOMER_REQUEST_SUCCESS",
  UPDATE_CUSTOMER_REQUEST_SUCCESS: "UPDATE_CUSTOMER_REQUEST_SUCCESS",
  DELETE_CUSTOMER_REQUEST_SUCCESS: "DELETE_CUSTOMER_REQUEST_SUCCESS",
};

export const policyConstants = {
  FETCH_POLICIES_REQUEST_SUCCESS: "FETCH_POLICIES_REQUEST_SUCCESS",
};

function createCustomer(customer, userToken) {
  //TODO: need to verify post api does return data (@peter)
  return (dispatch) => {
    // axios.post(`${SSF_API}/customer`, customer, {
    //   headers: {
    //     "x-auth-token": userToken,
    //   },
    // }).then(response => {
    //   dispatch({
    //     type: customerConstants.CREATE_CUSTOMER_REQUEST_SUCCESS,
    //     payload: response.data,
    //   });
    // })
    // TODO: error handling

    dispatch({
      type: customerConstants.CREATE_CUSTOMER_REQUEST_SUCCESS,
      payload: customer,
    });
    history.push("/customers")
  }
}

function removeCustomer(customerId, userToken) {
  return (dispatch) => {
    dispatch({
      type: customerConstants.DELETE_CUSTOMER_REQUEST_SUCCESS,
      payload: customerId,
    });
    // TODO: need to update api (@peter)
  }
}

function updateCustomer(customer, userToken) {
  return (dispatch) => {
    dispatch({
      type: customerConstants.UPDATE_CUSTOMER_REQUEST_SUCCESS,
      payload: customer,
    });
    // TODO: need to update api (@peter)
    // axios.post(`${SSF_API}/customer/${customer}`, customer, {
    //   headers: {
    //     "x-auth-token": userToken,
    //   },
    // }).then(response => {
    //   dispatch({
    //     type: customerConstants.UPDATE_CUSTOMER_REQUEST_SUCCESS,
    //     payload: response.data,
    //   });
    // })
    // TODO: error handling
  }
}

function fetchCustomers(userToken) {
  return (dispatch) => {
    axios
      .get(`${SSF_API}/customers`, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        dispatch({
          type: customerConstants.FETCH_CUSTOMERS_REQUEST_SUCCESS,
          payload: response.data,
        });
      });
      // TODO: error handling
  };
}

function addPolicy() {}

function removePolicy() {}

function updatePolicy() {}

function fetchPolicies(userToken) {
  return (dispatch) => {
    axios
      .get(`${SSF_API}/policies`, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        dispatch({
          type: policyConstants.FETCH_POLICIES_REQUEST_SUCCESS,
          payload: response.data,
        });
      });
  };
}

export const actions = {
  createCustomer,
  removeCustomer,
  updateCustomer,
  fetchCustomers,
  addPolicy,
  removePolicy,
  updatePolicy,
  fetchPolicies,
};
