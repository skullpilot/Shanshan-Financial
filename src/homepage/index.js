import React, { useState } from "react";
import { connect } from "react-redux";
import * as Lodash from "lodash";
import { actions } from "../redux/actions";

function HomePage({ createSession }) {
  const [user, setUser] = useState({ username: "", password: "" });

  const setField = Lodash.curry((field, event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [field]: value }));
  });

  const login = () => {
    if (!Lodash.isEmpty(user.username) && !Lodash.isEmpty(user.password)) {
      createSession(user.username, user.password);
    }
  };

  return (
    <div
      className="bg-local bg-center bg-cover bg-no-repeat h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1488998427799-e3362cec87c3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)`,
      }}
    >
      <div className="w-1/3 h-72 bg-blue-50 shadow flex flex-col justify-center items-center rounded-sm">
        <input
          name="email"
          placeholder=" Email"
          className="border rounded pl-2 mt-1 mb-2 w-3/4 h-10 shadow-md"
          onChange={setField("username")}
        />

        <input
          name="Password"
          placeholder=" Password"
          className="border rounded pl-2 mt-1 mb-2 w-3/4 h-10 shadow-md"
          onChange={setField("password")}
        />

        <div
          className="mt-1 cursor-pointer text-lg text-white h-10 w-3/4 bg-grey-darker hover:bg-grey-darkest rounded shadow-md flex justify-center items-center"
          onClick={() => login()}
        >
          Log in
        </div>
      </div>
    </div>
  );
}

const actionCreators = {
  createSession: actions.createSession,
};

const ConnectedHomePage = connect(null, actionCreators)(HomePage);

export default ConnectedHomePage;
