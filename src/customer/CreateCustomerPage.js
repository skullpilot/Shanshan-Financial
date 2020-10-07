import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Lodash from "lodash";

import { actions } from "../redux/actions";

function CreateCustomerPage({ createCustomer }) {
    // TODO: support ui form similar to detail page (@maria)
  return (
    <div>
      <h1>CreateCustomerPage</h1>
      <Button
        onClick={() =>
          createCustomer({
            wechatName: "asd",
            relationships: [],
            note: "feawfwefwe",
            attachments: [
              {
                url:
                  "https://ssf-user-attachments.s3.amazonaws.com/client-8-wkrpt401_done_v1.docx",
                fileName: "client-8-wkrpt401_done_v1.docx",
              },
              {
                url:
                  "https://ssf-user-attachments.s3.amazonaws.com/client-8-Coop_Final-Evaluation-reflective-writing.doc",
                fileName:
                  "client-8-Coop_Final-Evaluation-reflective-writing.doc",
              },
            ],
            address: "feawfewaef",
            id: "100",
            name: "will",
            phone: "123123123",
            wechatId: "will",
          })
        }
      >
        Create Customer
      </Button>
    </div>
  );
}

const actionCreators = {
  createCustomer: actions.createCustomer,
};

const ConnectedCreateCustomerPage = connect(
  null,
  actionCreators
)(CreateCustomerPage);

export default ConnectedCreateCustomerPage;
