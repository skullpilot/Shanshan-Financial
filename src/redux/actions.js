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
  DELETE_SESSION: "DELETE_SESSION",
};

export const customerConstants = {
  FETCH_CUSTOMERS_REQUEST_SUCCESS: "FETCH_CUSTOMERS_REQUEST_SUCCESS",
  CREATE_CUSTOMER_REQUEST: "CREATE_CUSTOMER_REQUEST",
  CREATE_CUSTOMER_REQUEST_SUCCESS: "CREATE_CUSTOMER_REQUEST_SUCCESS",
  UPDATE_CUSTOMER_REQUEST_SUCCESS: "UPDATE_CUSTOMER_REQUEST_SUCCESS",
  UPDATE_CUSTOMER_REQUEST: "UPDATE_CUSTOMER_REQUEST",
  DELETE_CUSTOMER_REQUEST_SUCCESS: "DELETE_CUSTOMER_REQUEST_SUCCESS",
};

export const policyConstants = {
  FETCH_POLICIES_REQUEST_SUCCESS: "FETCH_POLICIES_REQUEST_SUCCESS",
  CREATE_POLICY_REQUEST: "CREATE_POLICY_REQUEST",
  CREATE_POLICY_REQUEST_SUCCESS: "CREATE_POLICY_REQUEST_SUCCESS",
  UPDATE_POLICY_REQUEST_SUCCESS: "UPDATE_POLICY_REQUEST_SUCCESS",
  UPDATE_POLICY_REQUEST: "UPDATE_POLICY_REQUEST",
  DELETE_POLICY_REQUEST_SUCCESS: "DELETE_POLICY_REQUEST_SUCCESS",
};

export const attachmentConstants = {
  FETCH_ATTACHMENTS_REQUEST_SUCCESS: "FETCH_ATTACHMENTS_REQUEST_SUCCESS",
  FETCH_ATTACHMENTS_REQUEST_FAILURE: "FETCH_ATTACHMENTS_REQUEST_FAILURE",
  CREATE_ATTACHMENT: "CREATE_ATTACHMENT",
  CREATE_ATTACHMENT_SUCCESS: "CREATE_ATTACHMENT_SUCCESS",
  DELETE_ATTACHMENT: "DELETE_ATTACHMENT",
  DELETE_ATTACHMENT_SUCCESS: "DELETE_ATTACHMENT_SUCCESS",
};

export const dataStatusConstants = {
  FETCH_DATA_REQUEST: "FETCH_DATA_REQUEST",
  FETCH_DATA_REQUEST_SUCCESS: "FETCH_DATA_REQUEST_SUCCESS",
}

function createCustomer(customer, userToken) {
  return (dispatch) => {
    dispatch({
      type: customerConstants.CREATE_CUSTOMER_REQUEST,
    });
    axios
      .post(`${SSF_API}/customer`, customer, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        dispatch({
          type: customerConstants.CREATE_CUSTOMER_REQUEST_SUCCESS,
          payload: response.data,
        });
        history.push("/customers");
      });
    // TODO: error handling
  };
}

function removeCustomer(customerId, userToken) {
  return (dispatch) => {
    axios
      .delete(`${SSF_API}/customer/${customerId}`, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((res) => {
        dispatch({
          type: customerConstants.DELETE_CUSTOMER_REQUEST_SUCCESS,
          payload: customerId,
        });
        history.push("/customers");
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

function updateCustomer(customer, userToken) {
  return (dispatch) => {
    dispatch({
      type: customerConstants.UPDATE_CUSTOMER_REQUEST,
    });

    axios
      .post(`${SSF_API}/customer/${customer.id}`, customer, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        dispatch({
          type: customerConstants.UPDATE_CUSTOMER_REQUEST_SUCCESS,
          payload: response.data,
        });
      });
    // TODO: error handling
  };
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

function createPolicy(policy, userToken) {
  return (dispatch) => {
    dispatch({
      type: policyConstants.CREATE_POLICY_REQUEST,
    });

    axios
      .post(`${SSF_API}/policy`, policy, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        dispatch({
          type: policyConstants.CREATE_POLICY_REQUEST_SUCCESS,
          payload: response.data,
        });
        history.push("/policies");
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

function removePolicy(policyId, userToken) {
  return (dispatch) => {
    axios
      .delete(`${SSF_API}/policy/${policyId}`, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((res) => {
        dispatch({
          type: policyConstants.DELETE_POLICY_REQUEST_SUCCESS,
          payload: policyId,
        });
        history.push("/policies");
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

function updatePolicy(policy, userToken) {
  return (dispatch) => {
    dispatch({
      type: policyConstants.UPDATE_POLICY_REQUEST,
    });

    axios
      .post(`${SSF_API}/policy/${policy.id}`, policy, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        dispatch({
          type: policyConstants.UPDATE_POLICY_REQUEST_SUCCESS,
          payload: policy, // TODO: need to change back to response.data when api is refactored
        });
      });
    // TODO: error handling
  };
}

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

function createSession(username, password) {
  return (dispatch) => {
    dispatch({ type: sessionConstants.CREATE_SESSION });

    axios.post(`${SSF_API}/session`, { username, password }).then(
      (res) => {
        const { token } = res.data;
        localStorage.setItem("user", token);
        dispatch({
          type: sessionConstants.CREATE_SESSION_SUCCESS,
          payload: token,
        });

        history.push("/customers");
      },
      (error) => {
        dispatch({
          type: sessionConstants.CREATE_SESSION_FAILURE,
          payload: error,
        });
      }
    );
  };
}

function deleteSession() {
  return (dispatch) => {
    localStorage.removeItem("user");
    dispatch({ type: sessionConstants.DELETE_SESSION });
    history.push("/");
  };
}

function createAttachment(file, userToken) {
  return async (dispatch) => {
    dispatch({ type: attachmentConstants.CREATE_ATTACHMENT });

    try {
      let response = await axios.post(
        `${SSF_API}/attachment`,
        {
          fileName: file.name
        },
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      );

      const { signedRequest, url } = response.data;

      // TODO: need to verify if override and create behave similarily here(@peter)
      // I think if we need to implement delete, we only need to delete metadata in customer
      // no need to delete the actual file in S3, but this dependes the behavoir of S3 put api here
      response = await axios.put(
        signedRequest,
        file
      );

      dispatch({ type: attachmentConstants.CREATE_ATTACHMENT_SUCCESS, payload: { url, fileName: file.name } });
    } catch (err) {
      // TODO: better error handling here(@maria)
      console.log(err);
    }
  };
}

function deleteAttachment(fileName, userToken) {
  return (dispatch) => {
    axios.delete(`${SSF_API}/attachment/${fileName}`, {
      headers: {
        "x-auth-token": userToken,
      },
    }).then(response => {
      dispatch(
        { type: attachmentConstants.DELETE_ATTACHMENT_SUCCESS, payload: fileName }
      )
    })
  }
}

function fetchAttachments(userToken) {
  return (dispatch) => {
    axios
      .get(`${SSF_API}/attachments`, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        if (response.error) {

          return dispatch({
            type: attachmentConstants.FETCH_ATTACHMENTS_REQUEST_FAILURE
          });
        }
        dispatch({
          type: attachmentConstants.FETCH_ATTACHMENTS_REQUEST_SUCCESS,
          payload: response.data.data,
        });
      });
  };
}

function initialize(userToken) {
  return async (dispatch) => {
    dispatch({
      type: dataStatusConstants.FETCH_DATA_REQUEST,
    })

    const customersPromise = axios
      .get(`${SSF_API}/customers`, {
        headers: {
          "x-auth-token": userToken,
        },
      })

    const policiesPromise = axios
      .get(`${SSF_API}/policies`, {
        headers: {
          "x-auth-token": userToken,
        },
      })

    const attachmentsPromise = axios
      .get(`${SSF_API}/attachments`, {
        headers: {
          "x-auth-token": userToken,
        },
      })

    const [customersRes, policiesRes, attachmentsRes] = await Promise.all([customersPromise, policiesPromise, attachmentsPromise])

    dispatch({
      type: customerConstants.FETCH_CUSTOMERS_REQUEST_SUCCESS,
      payload: customersRes.data,
    });

    dispatch({
      type: policyConstants.FETCH_POLICIES_REQUEST_SUCCESS,
      payload: policiesRes.data,
    });

    dispatch({
      type: attachmentConstants.FETCH_ATTACHMENTS_REQUEST_SUCCESS,
      payload: attachmentsRes.data.data,
    });

    dispatch({
      type: dataStatusConstants.FETCH_DATA_REQUEST_SUCCESS,
    })
  }
}

export const actions = {
  createCustomer,
  removeCustomer,
  updateCustomer,
  createPolicy,
  removePolicy,
  updatePolicy,
  createSession,
  deleteSession,
  createAttachment,
  deleteAttachment,
  initialize
};
