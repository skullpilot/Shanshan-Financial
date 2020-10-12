import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../table";

const headCells = [
    { id: 'insuredName', disablePadding: true, label: 'Insured Name' },
    { id: 'company', disablePadding: false, label: 'Phone Number' },
    { id: 'plan', disablePadding: false, label: 'Email' },
    { id: 'policyNumber', disablePadding: false, label: 'Wechat ID' },
    { id: 'ownerName', disablePadding: false, label: 'Wechat Name' },
    { id: 'policyDate', disablePadding: false, label: 'Followup Date' },
];

function PolicyListPage({ policies }) {
    const history = useHistory();

    return (
        <Table rows={policies} headCells={headCells} handleItemClick={(id) => history.push(`/policy/${id}`)} handleCreateItem={() => history.push(`/policy`)} createItemText="Create Policy" />
    );
}

function mapState(state) {
  return {
    policies: Object.values(state.policies.data),
  };
}

const ConnectedPolicyListPage = connect(mapState)(PolicyListPage);

export default ConnectedPolicyListPage;