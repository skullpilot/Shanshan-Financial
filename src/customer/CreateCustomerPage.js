import React, { useState } from "react";
import { connect } from "react-redux";
import * as Lodash from "lodash";
import Validator from "validator";
import { actions } from "../redux/actions";
import Relationships from "./Relationships";

import Input from "./Input";
import Notes from "./Notes";
import Select from "./Select";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

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
      const phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.][0-9]{3}[-\s\.][0-9]{4}$/;
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
    <div className="flex flex-col items-center">
      <h5 className="text-xl">创建新客户</h5>
      <div className="grid gap-4 grid-cols-4 mx-24">
        <Input
          title="Name"
          placeholder="nickname"
          value={customer.name}
          onChange={setField("name")}
        />
        <Input
          title="* FirstName"
          value={customer.firstName}
          onChange={setField("firstName")}
          error={customerError.firstName.error}
          helperText={customerError.firstName.helperText}
        />
        <Input
          title="* LastName"
          value={customer.lastName}
          onChange={setField("lastName")}
          error={customerError.lastName.error}
          helperText={customerError.lastName.helperText}
        />
        <Select
          title="* Gender"
          value={customer.gender || ""}
          onChange={setField("gender")}
          error={customerError.gender.error}
          helperText={customerError.gender.helperText}
        >
          <option value=""> None</option>
          <option value="M"> Male</option>
          <option value="F"> Female</option>
        </Select>
        <Input
          title="Email"
          value={customer.email}
          onChange={setField("email")}
          error={customerError.email.error}
          helperText={customerError.email.helperText}
        />
        <Input
          title="Phone"
          value={customer.phone}
          placeholder="555-333-2222"
          onChange={setField("phone")}
          error={customerError.phone.error}
          helperText={customerError.phone.helperText}
        />
        <Input
          title="Birthday"
          placeholder="YYYY-MM-DD"
          value={customer.birthday}
          onChange={setField("birthday")}
          error={customerError.birthday.error}
          helperText={customerError.birthday.helperText}
        />
        <Input
          title="Wechat Name"
          value={customer.wechatName}
          onChange={setField("wechatName")}
        />
        <Input
          title="Wechat ID"
          value={customer.wechatID}
          onChange={setField("wechatID")}
        />
        <Input title="City" value={customer.city} onChange={setField("city")} />
        <Input
          title="Address"
          value={customer.address}
          onChange={setField("address")}
        />
        <Input
          title="Postcode"
          value={customer.postcode}
          onChange={setField("postcode")}
        />
        <Input
          title="Occupation"
          value={customer.occupation}
          onChange={setField("occupation")}
        />
        <Input
          title="客户类别"
          value={customer.customerSegment}
          onChange={setField("customerSegment")}
        />
      </div>

      <Relationships
        relationships={customer.relationships || []}
        updateRelationships={(relationships) =>
          setCustomer((prev) => ({ ...prev, relationships }))
        }
        menuItems={menuItems}
      />
      <Notes
        notes={customer.notes || {}}
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
        className="bg-blue-500 my-20 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() => {
          if (validate()) {
            let relationships = [];
            if (customer.relationships) {
              relationships = Lodash.filter(
                customer.relationships,
                (relationship) => {
                  return relationship.value !== "" && relationship.name !== "";
                }
              );
            }

            const filteredNote = {};
            if (customer.notes) {
              for (let [key, value] of Object.entries(customer.notes)) {
                if (value !== "") {
                  filteredNote[key] = value;
                }
              }
            }
            setCustomer((prev) => ({
              ...prev,
              relationships,
              notes: filteredNote,
            }));
            createCustomer(customer, userToken);
          }
        }}
      >
        创建
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
