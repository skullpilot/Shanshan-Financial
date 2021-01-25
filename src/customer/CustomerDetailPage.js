import React, { useState } from "react";
import { connect } from "react-redux";
import Lodash from "lodash";
import Validator from "validator";
import { actions } from "../redux/actions";
import Relationships from "./Relationships";

import Notes from "./Notes";
import Input from "./Input";
import Select from "./Select";
import { history } from "../history";

import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

function CustomerDetailPage({
  customerId,
  customers,
  policies,
  userToken,
  updateCustomer,
  removeCustomer,
}) {
  const customer = customers.data[customerId];
  const [customerState, setCustomerState] = useState(customer);
  const [customerError, setCustomerError] = useState({
    firstName: { helperText: "", error: false },
    lastName: { helperText: "", error: false },
    email: { helperText: "", error: false },
    phone: { helperText: "", error: false },
    gender: { helperText: "", error: false },
    birthday: { helperText: "", error: false },
  });

  if (!customer) {
    history.push("/customers");
    return <div>Redirecting...</div>;
  }

  const policyAsOwner = Lodash.filter(
    policies,
    (policy) => policy.ownerId === customer.id
  );
  const policyAsInsured = Lodash.filter(
    policies,
    (policy) => policy.insuredId === customer.id
  );
  const policyAsContact = Lodash.filter(
    policies,
    (policy) => policy.contactId === customer.id
  );

  if (!customer) {
    return <div>Can't find the customer information</div>;
  }

  const menuItems = Lodash.sortBy(Object.values(customers.data), [
    "firstName",
    "lastName",
  ]).map((customer) => (
    <option
      className="flex flex-row cursor:pointer hover:bg-grey-lighter"
      value={customer.id}
      key={customer.id}
    >
      {`${customer.firstName}, ${customer.lastName}`}
    </option>
  ));

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setCustomerState((prevState) => ({ ...prevState, [field]: value }));
  });

  const validateDelete = () => {
    if (
      Lodash.find(
        policies,
        { insuredId: customerId } || { ownerId: customerId }
      )
    ) {
      return false;
    }

    Lodash.forEach(customers.data, function (customer, ID) {
      if (
        customer.relationships !== undefined &&
        ID !== customerId &&
        Lodash.find(customer.relationships, { value: customerId })
      ) {
        return false;
      }
    });
    return true;
  };

  const validate = () => {
    let isValid = true;

    if (!customerState.firstName) {
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

    if (!customerState.lastName) {
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

    if (customerState.email && !Validator.isEmail(customerState.email)) {
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

    if (customerState.phone && !validatePhone(customerState.phone)) {
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

    if (!customerState.gender) {
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
      customerState.birthday &&
      !Validator.isDate(customerState.birthday, "YYYY-MM-DD")
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

  function policyItem(filterdPolicy, title) {
    return (
      <div className="mx-24 flex flex-col">
        <div className="text-xl mb-6">{title}</div>
        <div className="flex flex-col items-center">
          {filterdPolicy.map((policy) => (
            <div
              className="flex flex-row cursor-pointer px-8 py-4 hover:bg-gray-200 mb-4 border justify-between w-full"
              onClick={() => history.push(`/policy/${policy.id}`)}
              key={policy.id}
            >
              <div>
                {`Policy Owner: ${customers.data[policy.ownerId].firstName}, ${
                  customers.data[policy.ownerId].lastName
                }`}
              </div>
              <div>
                {`Policy Insured: ${
                  customers.data[policy.insuredId].firstName
                }, ${customers.data[policy.insuredId].lastName}`}
              </div>
              <div>{`Company: ${policy.company}`}</div>
              <div>{`Plan: ${policy.plan}`}</div>
              <div>{`Policy Number: ${policy.policyNumber}`}</div>
              <div>{`Policy Date: ${policy.policyDate}`}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h5 className="text-xl">客户详细信息</h5>
      <div className="grid gap-4 grid-cols-4 mx-24">
        <Input
          title="Name"
          placeholder="nickname"
          value={customerState.name}
          onChange={setField("name")}
        />
        <Input
          title="* FirstName"
          value={customerState.firstName}
          onChange={setField("firstName")}
          error={customerError.firstName.error}
          helperText={customerError.firstName.helperText}
        />
        <Input
          title="* LastName"
          value={customerState.lastName}
          onChange={setField("lastName")}
          error={customerError.lastName.error}
          helperText={customerError.lastName.helperText}
        />
        <Select
          title="* Gender"
          value={customerState.gender || ""}
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
          value={customerState.email}
          onChange={setField("email")}
          error={customerError.email.error}
          helperText={customerError.email.helperText}
        />
        <Input
          title="Phone"
          value={customerState.phone}
          placeholder="555-333-2222"
          onChange={setField("phone")}
          error={customerError.phone.error}
          helperText={customerError.phone.helperText}
        />
        <Input
          title="Birthday"
          placeholder="YYYY-MM-DD"
          value={customerState.birthday}
          onChange={setField("birthday")}
          error={customerError.birthday.error}
          helperText={customerError.birthday.helperText}
        />
        <Input
          title="Wechat Name"
          value={customerState.wechatName}
          onChange={setField("wechatName")}
        />
        <Input
          title="Wechat ID"
          value={customerState.wechatID}
          onChange={setField("wechatID")}
        />
        <Input
          title="City"
          value={customerState.city}
          onChange={setField("city")}
        />
        <Input
          title="Address"
          value={customerState.address}
          onChange={setField("address")}
        />
        <Input
          title="Postcode"
          value={customerState.postcode}
          onChange={setField("postcode")}
        />
        <Input
          title="Occupation"
          value={customerState.occupation}
          onChange={setField("occupation")}
        />
        <Input
          title="客户类别"
          value={customerState.customerSegment}
          onChange={setField("customerSegment")}
        />
      </div>

      <Relationships
        relationships={customerState.relationships || []}
        updateRelationships={(relationships) =>
          setCustomerState((prev) => ({ ...prev, relationships }))
        }
        menuItems={menuItems}
      />
      <Notes
        notes={customerState.notes || {}}
        updateNotes={(notes) =>
          setCustomerState((prev) => ({ ...prev, notes: notes }))
        }
      />
      <h5 className="my-8 text-xl">Related Policies</h5>
      <ul component="nav" className="w-screen">
        {policyItem(policyAsOwner, "Owner of Policies")}
        {policyItem(policyAsInsured, "Insured of Policies")}
        {policyItem(policyAsContact, "Contact Person of Policies")}
      </ul>

      <div>
        <Backdrop open={customers.isUpdatingCustomer}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <div className="flex flex-row mb-72 gap-8">
        <div
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={() => {
            if (validate()) {
              if (customerState.relationships) {
                customerState.relationships = Lodash.filter(
                  customerState.relationships,
                  (relationship) => {
                    return (
                      relationship.value !== "" && relationship.name !== ""
                    );
                  }
                );
              }
              let filteredNote = {};
              if (customerState.notes) {
                for (let [key, value] of Object.entries(customerState.notes)) {
                  if (value !== "") {
                    filteredNote[key] = value;
                  }
                }
              }
              setCustomerState((prev) => ({ ...prev, notes: filteredNote }));
              updateCustomer(customerState, userToken);
            }
          }}
        >
          保存修改
        </div>
        <div
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={() => {
            if (validateDelete()) {
              removeCustomer(customerId, userToken);
            } else {
              alert(
                "Cannot delete the current user since we still have policies or users connected to this user."
              );
            }
          }}
        >
          删除用户
        </div>
      </div>
    </div>
  );
}

function mapState(state, ownProps) {
  return {
    userToken: state.sessions.userToken,
    customers: state.customers,
    customerId: ownProps.match.params.customer_id,
    policies: state.policies.data,
  };
}

const actionCreators = {
  updateCustomer: actions.updateCustomer,
  removeCustomer: actions.removeCustomer,
};

const ConnectedCustomerDetailPage = connect(
  mapState,
  actionCreators
)(CustomerDetailPage);

export default ConnectedCustomerDetailPage;
