import React from "react";
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
  const [searchInput, setSearchInput] = React.useState("");
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const history = useHistory();

  function filterPolicy() {
    const filteredPolicies = Lodash.filter(policies, (policy) => {
      return (
        (customers[policy.insuredId].name &&
          customers[policy.insuredId].name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        customers[policy.insuredId].firstName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        customers[policy.insuredId].lastName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    });
    return filteredPolicies;
  }

  const debounceSearchKeyword = Lodash.debounce((value) => {
    setSearchKeyword(value);
  }, 500);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
    debounceSearchKeyword(event.target.value);
  };
  let displayPolicy = filterPolicy();

  const enhancedPolicies = displayPolicy.map((policy) => {
    const insuredLegalName = `${customers[policy.insuredId].firstName}, ${customers[policy.insuredId].lastName
      }`;
    const ownerLegalName = `${customers[policy.ownerId].firstName}, ${customers[policy.ownerId].lastName
      }`;
    return { ...policy, insuredLegalName, ownerLegalName };
  });
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Search Policy"
          onChange={handleSearch}
          value={searchInput}
          inputStyle={{ textAlign: "center" }}
          style={{ marginTop: "40px" }}
        />
      </div>

      <Table
        rows={enhancedPolicies}
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
