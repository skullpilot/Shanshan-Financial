import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../table";

const headCells = [
    { id: 'insurerLegalName', disablePadding: true, label: 'Insurer Legal Name' },
    { id: 'ownerLegalName', disablePadding: false, label: 'Owner Legal Name' },
    { id: 'company', disablePadding: false, label: 'Company' },
    { id: 'plan', disablePadding: false, label: 'Plan' },
    { id: 'policyNumber', disablePadding: false, label: 'Policy Number' },
    { id: 'policyDate', disablePadding: false, label: 'Policy Date' },
];

function PolicyListPage({ policies, customers }) {
    const history = useHistory();

    const enhancedPolicies = policies.map(policy => {
      const insurerLegalName = `${customers[policy.insurerId].firstName}, ${customers[policy.insurerId].lastName}`
      const ownerLegalName = `${customers[policy.ownerId].firstName}, ${customers[policy.ownerId].lastName}`
      return { ...policy, insurerLegalName, ownerLegalName}
    })
    return (
        <Table rows={enhancedPolicies} headCells={headCells} handleItemClick={(id) => history.push(`/policy/${id}`)} handleCreateItem={() => history.push(`/policy`)} createItemText="Create Policy" />
    );
}

function mapState(state) {
  return {
    policies: Object.values(state.policies.data),
    customers: state.customers.data,
  };
}

const ConnectedPolicyListPage = connect(mapState)(PolicyListPage);

export default ConnectedPolicyListPage;