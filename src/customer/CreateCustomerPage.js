import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import * as Lodash from "lodash";
import Validator from "validator";

import { actions } from "../redux/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            color: 'red',
            margin: theme.spacing(2, 5),
            width: 300,
        },
        textAlign: "center",
    },
}));

function CreateCustomerPage({ createCustomer }) {
    const classes = useStyles();
    const [customer, setCustomer] = useState({});
    const [customerError, setCustomerError] = useState({
        firstName: { helperText: '', error: false },
        lastName: { helperText: '', error: false },
        email: { helperText: '', error: false }
    });

    const setField = Lodash.curry((field, event) => {
        const { name, value } = event.target;
        setCustomer((prevState) => ({ ...prevState, [field]: value }));
    });

    const validate = () => {
        let isValid = true;

        // TODO: 1) Add validations to fields that you think it's necessary to validate
        //       2) How to refactor these code (@maria)
        if (!customer.firstName) {
            isValid = false;
            setCustomerError((prevState) => ({ ...prevState, firstName: { helperText: 'Please provide first name', error: true } }));
        } else {
            setCustomerError((prevState) => ({ ...prevState, firstName: { helperText: '', error: false } }));
        }

        if (!customer.lastName) {
            isValid = false;
            setCustomerError((prevState) => ({ ...prevState, lastName: { helperText: 'Please provide last name', error: true } }));
        } else {
            setCustomerError((prevState) => ({ ...prevState, lastName: { helperText: '', error: false } }));
        }

        if (!customer.email || !Validator.isEmail(customer.email)) {
            isValid = false;
            setCustomerError((prevState) => ({ ...prevState, email: { helperText: 'Please provide email', error: true } }));
        } else {
            setCustomerError((prevState) => ({ ...prevState, email: { helperText: '', error: false } }));
        }

        return isValid;
    }

    // TODO: support ui form similar to detail page (@maria)
    // TODO: add validation support (@maria)
    // TODO: add specific input support (@maria) eg. date format, phone format
    return (
        <div>
            <div className={classes.root}>
                <h3>New Customer</h3>
                <div>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={customer.firstName || ''}
                        onChange={setField("firstName")}
                        error={customerError.firstName.error}
                        helperText={customerError.firstName.helperText}
                        required
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={customer.lastName || ''}
                        onChange={setField("lastName")}
                        error={customerError.lastName.error}
                        helperText={customerError.lastName.helperText}
                        required
                    />
                    <TextField
                        label="Name"
                        variant="outlined"
                        value={customer.name || ''}
                        onChange={setField("name")}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={customer.email || ''}
                        onChange={setField("email")}
                        error={customerError.email.error}
                        helperText={customerError.email.helperText}
                        required
                    />
                    <TextField
                        label="Phone"
                        variant="outlined"
                        value={customer.phone || ''}
                        onChange={setField("phone")}
                    />
                    <TextField
                        label="Birthday"
                        variant="outlined"
                        value={customer.birthday || ''}
                        onChange={setField("birthday")}
                    />
                    <TextField
                        label="Wechat Name"
                        variant="outlined"
                        value={customer.wechatName || ''}
                        onChange={setField("wechatName")}
                    />
                    <TextField
                        label="Wechat ID"
                        variant="outlined"
                        value={customer.wechatId || ''}
                        onChange={setField("wechatId")}
                    />
                    <TextField
                        label="City"
                        variant="outlined"
                        value={customer.city || ''}
                        onChange={setField("city")}
                    />
                    <TextField
                        label="Address"
                        variant="outlined"
                        value={customer.address || ''}
                        onChange={setField("address")}
                    />
                </div>
                <div>
                    <TextField
                        label="Notes"
                        variant="outlined"
                        rows={6}
                        multiline
                        value={customer.notes || ''}
                        onChange={setField("notes")}
                        style={{ width: "50%" }} // TODO: support responsive design here, use css media (@maria)
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "100px", marginBottom: "200px" }}
                    onClick={() => {
                        if (validate()) {
                            createCustomer({
                                id: "100",
                                ...customer,
                            })
                        }
                    }}
                >
                    Create Customer
        </Button>
            </div>
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
