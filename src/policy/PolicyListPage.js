import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../table";

const headCells = [
    { id: 'insuredName', disablePadding: true, label: 'Insured Name' },
    { id: 'company', disablePadding: false, label: 'Company' },
    { id: 'plan', disablePadding: false, label: 'Plan' },
    { id: 'policyNumber', disablePadding: false, label: 'Policy Number' },
    { id: 'ownerName', disablePadding: false, label: 'Owner Name' },
    { id: 'policyDate', disablePadding: false, label: 'Policy Date' },
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