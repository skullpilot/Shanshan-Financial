import axios from "axios";
import { SSF_API } from "../config";

export const customerConstants = {
  FETCH_CUSTOMERS_REQUEST_SUCCESS: "FETCH_CUSTOMERS_REQUEST_SUCCESS",
  ADD_CUSTOMER_REQUEST_SUCCESS: "ADD_CUSTOMER_REQUEST_SUCCESS",
  UPDATE_CUSTOMER_REQUEST_SUCCESS: "UPDATE_CUSTOMER_REQUEST_SUCCESS",
  DELETE_CUSTOMER_REQUEST_SUCCESS: "DELETE_CUSTOMER_REQUEST_SUCCESS",
};

export const policyConstants = {
  FETCH_POLICIES_REQUEST_SUCCESS: "FETCH_POLICIES_REQUEST_SUCCESS",
};

function addCustomer(customer, userToken) {
  return (dispatch) => {
    axios.post(`${SSF_API}/customer`, customer, {
      headers: {
        "x-auth-token": userToken,
      },
    }).then(response => {
      dispatch({
        type: customerConstants.ADD_CUSTOMER_REQUEST_SUCCESS,
        payload: response.data,
      });
    })
    // TODO: error handling
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
  addCustomer,
  removeCustomer,
  updateCustomer,
  fetchCustomers,
  addPolicy,
  removePolicy,
  updatePolicy,
  fetchPolicies,
};
