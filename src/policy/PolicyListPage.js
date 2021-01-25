import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Table from "../table";
import TextField from "@material-ui/core/TextField";
import * as Lodash from "lodash";

const headCells = [
  { id: "insuredLegalName", disablePadding: true, label: "Insured Legal Name" },
  { id: "ownerLegalName", disablePadding: false, label: "Owner Legal Name" },
  { id: "company", disablePadding: false, label: "Company" },
  { id: "plan", disablePadding: false, label: "Plan" },
  { id: "policyNumber", disablePadding: false, label: "Policy Number" },
  { id: "policyDate", disablePadding: false, label: "Policy Date" },
];

function PolicyListPage({ policies, customers }) {
  const history = useHistory();
  const [searchContent, setSearchContent] = useState({ searchType: null, searchValue: null });

  const policiesWithNames = policies.map((policy) => {
    const insuredLegalName = `${customers[policy.insuredId].firstName}, ${customers[policy.insuredId].lastName
      }`;
    const ownerLegalName = `${customers[policy.ownerId].firstName}, ${customers[policy.ownerId].lastName
      }`;
    return { ...policy, insuredLegalName, ownerLegalName };
  });


  function filterPolicyByName(policiesWithNames, customers, val) {
    const input = val.toLowerCase();

    const filteredPolicies = Lodash.filter(policiesWithNames, (policy) => {
      const insured = customers[policy.insuredId]
      const owner = customers[policy.ownerId]

      const matchInsured = (insured.name &&
        insured.name.toLowerCase().includes(input)) ||  policy.insuredLegalName.toLowerCase().includes(input)

      const matchOwner = (owner.name &&
        owner.name.toLowerCase().includes(input)) || policy.ownerLegalName.toLowerCase().includes(input)

      return matchInsured || matchOwner
    });

    return filteredPolicies;
  }

  function filterPolicyByMonth(policiesWithNames, val) {
    return policiesWithNames.filter(policy => policy.policyDate && policy.policyDate.split("-")[1] === val)
  }

  function filterPolicyByYear(policiesWithNames, val) {
    return policiesWithNames.filter(policy => policy.policyDate && policy.policyDate.split("-")[0] === val)
  }

  function filterPolicyByPlan(policiesWithNames, val) {
    return policiesWithNames.filter(policy => policy.plan && policy.plan.startsWith(val))
  }

  function filterPolicyByCompany(policiesWithNames, val) {
    return policiesWithNames.filter(policy => policy.company && policy.company.startsWith(val))
  }


  let displayPolicies = policiesWithNames
  if (searchContent.searchType) {
    if (searchContent.searchType === "CUSTOMER_NAME") {
      displayPolicies = filterPolicyByName(policiesWithNames, customers, searchContent.searchValue)
    } else if (searchContent.searchType === "MONTH") {
      displayPolicies = filterPolicyByMonth(policiesWithNames, searchContent.searchValue)
    } else if (searchContent.searchType === "YEAR") {
      displayPolicies = filterPolicyByYear(policiesWithNames, searchContent.searchValue)
    } else if (searchContent.searchType === "PLAN") {
      displayPolicies = filterPolicyByPlan(policiesWithNames, searchContent.searchValue)
    } else if (searchContent.searchType === "COMPANY") {
      displayPolicies = filterPolicyByCompany(policiesWithNames, searchContent.searchValue)
    }
  }

  const searchCustomerValue = searchContent.searchType === "CUSTOMER_NAME" && searchContent.searchValue ? searchContent.searchValue : ""
  const searchMonthValue = searchContent.searchType === "MONTH" && searchContent.searchValue ? searchContent.searchValue : ""
  const searchYearValue = searchContent.searchType === "YEAR" && searchContent.searchValue ? searchContent.searchValue : ""
  const searchPlanValue = searchContent.searchType === "PLAN" && searchContent.searchValue ? searchContent.searchValue : ""
  const searchCompanyValue = searchContent.searchType === "COMPANY" && searchContent.searchValue ? searchContent.searchValue : ""

  return (
    <div className="flex flex-col">
      <div className="text-2xl mx-auto ">珊珊财富 - 保单列表</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "40px"
        }}
      >
        <TextField
          label="Customer Name"
          onChange={(event) => setSearchContent({ searchType: "CUSTOMER_NAME", searchValue: event.target.value })}
          value={searchCustomerValue}
        />
        <TextField
          label="month"
          onChange={(event) => setSearchContent({ searchType: "MONTH", searchValue: event.target.value })}
          value={searchMonthValue}
        />
        <TextField
          label="year"
          onChange={(event) => setSearchContent({ searchType: "YEAR", searchValue: event.target.value })}
          value={searchYearValue}
        />
        <TextField
          label="plan"
          onChange={(event) => setSearchContent({ searchType: "PLAN", searchValue: event.target.value })}
          value={searchPlanValue}
        />
        <TextField
          label="company"
          onChange={(event) => setSearchContent({ searchType: "COMPANY", searchValue: event.target.value })}
          value={searchCompanyValue}
        />
      </div>

      <Table
        rows={displayPolicies}
        headCells={headCells}
        handleItemClick={(id) => history.push(`/policy/${id}`)}
        handleCreateItem={() => history.push(`/policy`)}
        createItemText="Create Policy"
      />
    </div>
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
