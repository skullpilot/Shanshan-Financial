import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import { actions } from "../redux/actions";
import { history } from "../history";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function BirthdayTemplates({
  attachments,
  createAttachment,
  deleteAttachment,
  userToken,
}) {
  const classes = useStyles();
  const [file, setFile] = useState(null);

  const handleFileUpload = async () => {
    if (!file) {
      return;
    }
    createAttachment(file, userToken);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Backdrop className={classes.backdrop} open={attachments.requesting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="text-xl">Birthday Attachments</div>
      <div className="flex justify-center">
        <ul>
          {attachments.data &&
            attachments.data.map((attachment) => (
              <div key={attachment.fileName} className="flex items-center my-4">
                <div className="flex flex-row">
                  <div
                    className="cursor-pointer text-grey-darker underline mr-4 text-lg"
                    onClick={() =>
                      document.getElementById(attachment.fileName).click()
                    }
                  >
                    {attachment.fileName}
                  </div>
                  <div
                    className="cursor-pointer text-red-500 text-lg"
                    onClick={() => {
                      deleteAttachment(attachment.fileName, userToken);
                    }}
                  >
                    delete
                  </div>
                  <a
                    id={attachment.fileName}
                    href={attachment.url}
                    download
                    hidden
                  ></a>
                </div>
              </div>
            ))}
        </ul>
      </div>
      <h5 className="mb-2 mt-4">
        Selected File To Upload: {file && file.name}
      </h5>
      <div className="flex flex-row mb-2">
        <label className="mr-6">
          <input
            className="hidden"
            type="file"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <div className="cursor-pointer h-8 w-32 bg-blue-400 hover:bg-blue-600 rounded shadow flex justify-center items-center">
            <div>CHOOSE FILE</div>
          </div>
        </label>
        <div
          className="cursor-pointer h-8 w-32 bg-blue-400 hover:bg-blue-600 rounded shadow flex justify-center items-center"
          onClick={() => handleFileUpload()}
        >
          <div>UPLOAD FILE</div>
        </div>
      </div>
    </div>
  );
}

const ConnectedBirthdayTemplates = connect(
  (state) => {
    return {
      attachments: state.attachments,
      userToken: state.sessions.userToken,
    };
  },
  {
    createAttachment: actions.createAttachment,
    deleteAttachment: actions.deleteAttachment,
  }
)(BirthdayTemplates);

function BirthdayListPage({ customers }) {
  function sortDate(a, b) {
    const A = Math.abs(moment(a).subtract(moment(a).year(), "years"));
    const B = Math.abs(moment(b).subtract(moment(b).year(), "years"));
    return B - A;
  }

  function sortBirthday() {
    let currYear = [];
    let nextYear = [];
    let date = new Date();
    date.setDate(date.getDate() - 1);

    customers.map((customer) => {
      if (customer.birthday) {
        if (sortDate(customer.birthday, date) > 0) {
          currYear.push(customer);
        } else {
          nextYear.push(customer);
        }
      }
    });
    currYear.sort((a, b) => sortDate(a.birthday, b.birthday));
    nextYear.sort((a, b) => sortDate(a.birthday, b.birthday));
    return currYear.concat(nextYear);
  }

  const customersWithBirthday = sortBirthday();

  return (
    <div>
      <ConnectedBirthdayTemplates />
      <div className="h-px bg-grey-dark" />
      <div className="flex flex-col items-center">
        {customersWithBirthday.map((cx) => (
          <div
            className="flex flex-row items-center my-6"
            key={cx.id}
            onClick={() => {
              history.push(`/customer/${cx.id}`);
            }}
          >
            <div className="text-2xl mr-4">
              {moment(cx.birthday).format("MM-DD")}
            </div>
            <div className="shadow-2xl rounded-lg w-96 p-4 cursor-pointer hover:bg-blue-500">
              <div className="mb-4">{`${cx.firstName}, ${cx.lastName}`}</div>
              <div className="">{`Birthday: ${cx.birthday || "unknown"}`}</div>
              <div className="">{`Phone: ${cx.phone || "unknown"}`}</div>
              <div className="">{`Email: ${cx.email || "unknown"}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
  };
}

const ConnectedBirthdayListPage = connect(mapState)(BirthdayListPage);

export default ConnectedBirthdayListPage;
