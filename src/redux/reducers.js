import { combineReducers } from "redux";
import * as Lodash from "lodash"
import * as Actions from "./actions"

function customers(state = { isInitialized: false, data: [] }, action) {
    switch (action.type) {
        case Actions.customerConstants.FETCH_CUSTOMERS_REQUEST_SUCCESS:
            return { isInitialized: true, data: Lodash.keyBy(action.payload, 'id') };
        case Actions.customerConstants.ADD_CUSTOMER_REQUEST_SUCCESS:
            return { ...state, data: { ...state.data, [action.payload.id]: action.payload } };
        case Actions.customerConstants.UPDATE_CUSTOMER_REQUEST_SUCCESS:
            return { ...state, data: { ...state.data, [action.payload.id]: action.payload } };
        case Actions.customerConstants.DELETE_CUSTOMER_REQUEST_SUCCESS:
            return { ...state, data: { ...Lodash.omit(state.data, [action.payload]) } };
        default:
            return state;
    }
}

function policies(state = { isInitialized: false, data: [] }, action) {
    switch (action.type) {
        case Actions.policyConstants.FETCH_POLICIES_REQUEST_SUCCESS:
            return { isInitialized: true, data: Lodash.keyBy(action.payload, 'id') };
        default:
            return state;
    }
}

export default combineReducers({ customers, policies });
