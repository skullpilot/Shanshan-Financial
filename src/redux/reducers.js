import { combineReducers } from "redux";
import * as Lodash from "lodash";
import * as Actions from "./actions";

function customers(
  state = { isInitialized: false, data: {}, isUpdatingCustomer: false, isCreatingCustomer: false },
  action
) {
  switch (action.type) {
    case Actions.customerConstants.FETCH_CUSTOMERS_REQUEST_SUCCESS:
      return { ...state, isInitialized: true, data: Lodash.keyBy(action.payload, "id") };
    case Actions.customerConstants.CREATE_CUSTOMER_REQUEST_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload.id]: action.payload },
        isCreatingCustomer: false,
      };
    case Actions.customerConstants.UPDATE_CUSTOMER_REQUEST_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload.id]: action.payload },
        isUpdatingCustomer: false,
      };
    case Actions.customerConstants.UPDATE_CUSTOMER_REQUEST:
      return { ...state, isUpdatingCustomer: true };
    case Actions.customerConstants.UPDATE_CUSTOMER_REQUEST:
      return { ...state, isCreatingCustomer: true };
    case Actions.customerConstants.DELETE_CUSTOMER_REQUEST_SUCCESS:
      return { ...state, data: { ...Lodash.omit(state.data, [action.payload]) } };
    default:
      return state;
  }
}

function policies(state = { isInitialized: false, data: {}, isUpdatingPolicy: false }, action) {
  switch (action.type) {
    case Actions.policyConstants.FETCH_POLICIES_REQUEST_SUCCESS:
      return { ...state, isInitialized: true, data: Lodash.keyBy(action.payload, "id") };
    case Actions.policyConstants.CREATE_POLICY_REQUEST_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload.id]: action.payload },
        isUpdatingPolicy: false,
      };
    case Actions.policyConstants.UPDATE_POLICY_REQUEST_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload.id]: action.payload },
        isUpdatingPolicy: false,
      };
    case Actions.policyConstants.UPDATE_POLICY_REQUEST:
      return { ...state, isUpdatingPolicy: true };
    case Actions.policyConstants.DELETE_POLICY_REQUEST_SUCCESS:
      return { ...state, data: { ...Lodash.omit(state.data, [action.payload]) } };
    default:
      return state;
  }
}

const userToken = localStorage.getItem("user") ? localStorage.getItem("user") : null;

function sessions(state = { userToken, requesting: false }, action) {
  switch (action.type) {
    case Actions.sessionConstants.CREATE_SESSION:
      return { ...state, requesting: true };
    case Actions.sessionConstants.CREATE_SESSION_SUCCESS:
      return { userToken: action.payload, requesting: false };
    case Actions.sessionConstants.CREATE_SESSION_FAILURE:
      return { userToken: null, requesting: false };
    case Actions.sessionConstants.DELETE_SESSION:
      return { userToken: null, requesting: false };
    default:
      return state;
  }
}

function attachments(state = { isInitialized: false, requesting: false, data: [] }, action) {
  switch (action.type) {
    case Actions.attachmentConstants.FETCH_ATTACHMENTS_REQUEST_SUCCESS:
      return { isInitialized: true, data: action.payload };
    case Actions.attachmentConstants.CREATE_ATTACHMENT:
      return { ...state, requesting: true };
    case Actions.attachmentConstants.CREATE_ATTACHMENT_SUCCESS:
      const isUpdate = Lodash.find(
        state.data,
        (attachment) => attachment.fileName === action.payload.fileName
      );
      return isUpdate
        ? { ...state, requesting: false }
        : { ...state, requesting: false, data: state.data.concat([action.payload]) };
    case Actions.attachmentConstants.DELETE_ATTACHMENT:
      return state;
    case Actions.attachmentConstants.DELETE_ATTACHMENT_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: state.data.filter((attachment) => attachment.fileName !== action.payload.fileName),
      };
    default:
      return state;
  }
}

export default combineReducers({ customers, policies, sessions, attachments });
