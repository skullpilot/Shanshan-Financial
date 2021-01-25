import React, { useState } from "react";
import { connect } from "react-redux";
import * as Lodash from "lodash";
import Validator from "validator";
import { actions } from "../redux/actions";
import Relationships from "./Relationships";
import Notes from "./Notes";

import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({}));

function CreateCustomerPage({ createCustomer, userToken, customers }) {
  const classes = useStyles();
  const [customer, setCustomer] = useState({});
  const [customerError, setCustomerError] = useState({
    firstName: { helperText: "", error: false },
    lastName: { helperText: "", error: false },
    email: { helperText: "", error: false },
    phone: { helperText: "", error: false },
    gender: { helperText: "", error: false },
    birthday: { helperText: "", error: false },
  });

  const menuItems = Object.values(customers.data).map((customer) => (
    <div
      className="flex flex-row cursor:pointer hover:bg-grey-lighter"
      value={customer.id}
      key={customer.id}
    >{`${customer.firstName}, ${customer.lastName}`}</div>
  ));

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomer((prevState) => ({ ...prevState, [field]: value }));
  });

  const validate = () => {
    let isValid = true;

    if (!customer.firstName) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        firstName: { helperText: "Please provide first name", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        firstName: { helperText: "", error: false },
      }));
    }

    if (!customer.lastName) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        lastName: { helperText: "Please provide last name", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        lastName: { helperText: "", error: false },
      }));
    }

    if (customer.email && !Validator.isEmail(customer.email)) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        email: { helperText: "Please provide correct email", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        email: { helperText: "", error: false },
      }));
    }

    function validatePhone(p) {
      const phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
      return phoneRe.test(p);
    }

    if (customer.phone && !validatePhone(customer.phone)) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        phone: {
          helperText: "Please provide correct phone number",
          error: true,
        },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        phone: { helperText: "", error: false },
      }));
    }

    if (!customer.gender) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        gender: { helperText: "Please provide gender", error: true },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        gender: { helperText: "", error: false },
      }));
    }

    if (
      customer.birthday &&
      !Validator.isDate(customer.birthday, "YYYY-MM-DD")
    ) {
      isValid = false;
      setCustomerError((prevState) => ({
        ...prevState,
        birthday: {
          helperText: "Please provide birthday in format YYYY-MM-DD",
          error: true,
        },
      }));
    } else {
      setCustomerError((prevState) => ({
        ...prevState,
        birthday: { helperText: "", error: false },
      }));
    }

    return isValid;
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <h3>New Customer</h3>
        <div className="flex flex-wrap justify-center max-w-xl">
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">First Name</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="First Name"
              value={customer.firstName || ""}
              onChange={setField("firstName")}
              error={customerError.firstName.error}
              helperText={customerError.firstName.helperText}
              type="text"
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Last Name</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Last Name"
              value={customer.lastName || ""}
              onChange={setField("lastName")}
              error={customerError.lastName.error}
              helperText={customerError.lastName.helperText}
              type="text"
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Name</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Last Name"
              value={customer.name || ""}
              onChange={setField("name")}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Gender*</label>
            <select
              className="w-96 h-12 mr-6 ml-6 border rounded text-align-last-center"
              name="gender"
              error={customerError.gender.error}
              value={customer.gender || ""}
              onChange={setField("gender")}
              helperText={customerError.gender.helperText}
              required
            >
              <option value=""> None</option>
              <option value="M"> Male</option>
              <option value="F"> Female</option>
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Email</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Email"
              value={customer.email || ""}
              onChange={setField("email")}
              error={customerError.email.error}
              helperText={customerError.email.helperText}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Phone</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Phone"
              value={customer.phone || ""}
              onChange={setField("phone")}
              error={customerError.phone.error}
              helperText={customerError.phone.helperText}
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Birthday</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Birthday"
              value={customer.birthday || ""}
              onChange={setField("birthday")}
              InputLabelProps={{
                shrink: true,
              }}
              error={customerError.birthday.error}
              helperText={customerError.birthday.helperText}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Wechat Name</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Wechat Name"
              value={customer.wechatName || ""}
              onChange={setField("wechatName")}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Wechat ID</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Wechat ID"
              value={customer.wechatId || ""}
              onChange={setField("wechatId")}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">City</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="City"
              value={customer.city || ""}
              onChange={setField("city")}
              type="text"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Address</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Address"
              value={customer.address || ""}
              onChange={setField("address")}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Postcode</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Postcode"
              value={customer.postcode || ""}
              onChange={setField("postcode")}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">Occupation</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="Occupation"
              value={customer.occupation || ""}
              onChange={setField("occupation")}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="mt-4 ml-8 text-xs">CustomerSegment</label>
            <input
              className="w-96 h-12 mr-6 ml-6 border rounded text-center"
              placeholder="CustomerSegment"
              value={customer.customerSegment || ""}
              onChange={setField("customerSegment")}
            />
          </div>
        </div>

        <h5 className="mt-4">Relationships</h5>
        <Relationships
          relationships={customer.relationships || []}
          updateRelationships={(relationships) =>
            setCustomer((prev) => ({ ...prev, relationships }))
          }
          menuItems={menuItems}
        />

        <Notes
          notes={customer.notes || []}
          updateNotes={(notes) =>
            setCustomer((prev) => ({ ...prev, notes: notes }))
          }
        />
        <div>
          <Backdrop
            className={classes.backdrop}
            open={customers.isCreatingCustomer}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>

        <div
          className="active:bg-grey-darker mt-100px mb-8 cursor-pointer h-8 w-96 border-solid border bg-grey-light hover:bg-grey rounded shadow-md flex flex-row justify-center items-center"
          onClick={() => {
            if (validate()) {
              if (customer.relationships) {
                customer.relationships = Lodash.filter(
                  customer.relationships,
                  (relationship) => {
                    return (
                      relationship.value !== "" && relationship.name !== ""
                    );
                  }
                );
              }

              let filteredNote = {};
              if (customer.notes) {
                for (let [key, value] of Object.entries(customer.notes)) {
                  if (value !== "") {
                    filteredNote[key] = value;
                  }
                }
              }
              setCustomer((prev) => ({ ...prev, notes: filteredNote }));
              createCustomer(customer, userToken);
            }
          }}
        >
          <div className="font-semibold text-grey-darkest">Create Customer</div>
        </div>
      </div>
    </div>
  );
}

function mapState(state) {
  return {
    customers: state.customers,
    userToken: state.sessions.userToken,
  };
}

const actionCreators = {
  createCustomer: actions.createCustomer,
};

const ConnectedCreateCustomerPage = connect(
  mapState,
  actionCreators
)(CreateCustomerPage);

export default ConnectedCreateCustomerPage;
