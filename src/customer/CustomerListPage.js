import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Table from "../table";
import Lodash from "lodash";

const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: true,
    label: "First Name",
  },
  { id: "lastName", numeric: false, disablePadding: true, label: "Last Name" },
  { id: "phone", numeric: true, disablePadding: false, label: "Phone Number" },
  { id: "email", numeric: true, disablePadding: false, label: "Email" },
  {
    id: "lastFollowupDate",
    numeric: false,
    disablePadding: false,
    label: "Last Followup Date",
  },
  {
    id: "lastFollowupNote",
    numeric: false,
    disablePadding: false,
    label: "Last Followup Note",
  },
  {
    id: "customerSegment",
    numeric: false,
    disablePadding: false,
    label: "Customer Segment",
  },
];

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CustomerListPage({ customers, policies }) {
  const history = useHistory();
  const query = useQuery();
  const [searchContent, setSearchContent] = useState({ searchType: null, searchValue: null });

  useEffect(() => {
    const searchType = query.get("type");
    let searchValue = query.get("value");
    if (searchValue === 'true') {
      searchValue = true
    } else {
      searchValue = false
    }
    setSearchContent({searchType, searchValue})
  }, [])

  const customersWithFollowupInfo = customers.map(customer => {
    if (!customer.notes) {
      return { ...customer, lastFollowupDate: "", lastFollowupNote: "" };
    }
    const maxKey = Lodash.max(Object.keys(customer.notes));
    return {
      ...customer,
      lastFollowupDate: maxKey,
      lastFollowupNote: customer.notes[maxKey],
    };
  });

  const customerIdsWithPolicy = new Set();
  Lodash.forEach(policies, (policy) => {
    customerIdsWithPolicy.add(policy.ownerId);
    customerIdsWithPolicy.add(policy.insuredId);
  });

  const customersWithoutPolicy = Lodash.filter(
    customersWithFollowupInfo,
    (customer) => {
      return !customerIdsWithPolicy.has(customer.id);
    }
  );

  function filterCustomer(customers, name) {
    return Lodash.filter(customers, (customer) => {
      return (
        (customer.name && customer.name.toLowerCase().includes(name)) ||
        (customer.firstName &&
          customer.firstName.toLowerCase().includes(name)) ||
        (customer.lastName && customer.lastName.toLowerCase().includes(name))
      );
    });
  }

  const handleInputUpdate = (type, event) => {
    if (type === "CUSTOMER_NAME") {
      history.push({
        pathname: '/customers',
        search: `?type=${type}&value=${event.target.value}`
      })
      setSearchContent({ searchType: type, searchValue: event.target.value })
    } else if (type === "CUSTOMER_NO_POLICIES") {
      history.push({
        pathname: '/customers',
        search: `?type=${type}&value=${event.target.checked}`
      })
      setSearchContent({ searchType: type, searchValue: event.target.checked })
    } else if (type === "CUSTOMER_SEGMENT") {
      history.push({
        pathname: '/customers',
        search: `?type=${type}&value=${event.target.value}`
      })
      setSearchContent({ searchType: type, searchValue: event.target.value })
    }
  };

  let displayCustomers = customersWithFollowupInfo;
  if (searchContent.searchType) {
    if (searchContent.searchType === "CUSTOMER_NAME" && searchContent.searchValue) {
      displayCustomers = filterCustomer(
        customersWithFollowupInfo,
        searchContent.searchValue.toLowerCase()
      );
    } else if (searchContent.searchType === "CUSTOMER_NO_POLICIES") {
      displayCustomers = searchContent.searchValue
        ? customersWithoutPolicy
        : customersWithFollowupInfo;
    } else if (searchContent.searchType === "CUSTOMER_SEGMENT" && searchContent.searchValue) {
      displayCustomers = Lodash.filter(
        customersWithFollowupInfo,
        (customer) =>
          customer.customerSegment &&
          customer.customerSegment
            .toLowerCase()
            .includes(searchContent.searchValue.toLowerCase())
      );
    }
  }

  const searchCustomerWithoutPoliciesValue =
    searchContent.searchType === "CUSTOMER_NO_POLICIES" &&
    searchContent.searchValue;
  const searchCustomerValue =
    searchContent.searchType === "CUSTOMER_NAME" && searchContent.searchValue
      ? searchContent.searchValue
      : "";
  const searchCustomerSegmentValue =
    searchContent.searchType === "CUSTOMER_SEGMENT" && searchContent.searchValue
      ? searchContent.searchValue
      : "";

  return (
    <div className="flex flex-col">
      <div className="text-2xl mx-auto ">珊珊财富 - 用户列表</div>

      <div className="flex flex-row justify-around items-center content-around mt-8 ml-8">
        <div>
          <input
            type="checkbox"
            checked={searchCustomerWithoutPoliciesValue}
            onChange={(event) =>
              handleInputUpdate("CUSTOMER_NO_POLICIES", event)
            }
          />
          <label className="ml-4">显示未办保险用户</label>
        </div>
        <div className="flex flex-col">
          <input
            className="w-64 h-10 mr-6 ml-6 border rounded text-center"
            placeholder="搜索用户名字"
            onChange={(event) => handleInputUpdate("CUSTOMER_NAME", event)}
            value={searchCustomerValue}
          />
        </div>
        <div className="flex flex-col">
          <input
            className="w-64 h-10 mr-6 ml-6 border rounded text-center"
            placeholder="搜索用户类别"
            onChange={(event) => handleInputUpdate("CUSTOMER_SEGMENT", event)}
            value={searchCustomerSegmentValue}
          />
        </div>
      </div>
      <Table
        rows={displayCustomers}
        headCells={headCells}
        handleItemClick={(id) => history.push(`/customer/${id}`)}
        handleCreateItem={() => history.push(`/customer`)}
        createItemText="Create Customer"
      />
    </div>
  );
}

function mapState(state) {
  return {
    customers: Object.values(state.customers.data),
    policies: Object.values(state.policies.data),
  };
}

const ConnectedCustomerListPage = connect(mapState)(CustomerListPage);

export default ConnectedCustomerListPage;
