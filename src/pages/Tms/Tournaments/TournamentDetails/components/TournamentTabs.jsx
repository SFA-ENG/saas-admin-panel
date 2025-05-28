import { useState } from "react";
import { Tabs } from "antd";
import { InfoIcon } from "../components/Icons";
import { BarChart } from "../components/Icons";
import OverviewTab from "./OverviewTab";
import StatsTab from "./StatsTab";

const TournamentTabs = ({ tournament, activeTab, handleTabChange }) => {
  // Use internal state if props are not provided for backward compatibility
  const [internalActiveKey, setInternalActiveKey] = useState("overview");
  
  // Determine which active key and change handler to use
  const effectiveActiveKey = activeTab || internalActiveKey;
  const effectiveChangeHandler = handleTabChange || setInternalActiveKey;
  
  return (
    <Tabs
      type="card"
      activeKey={effectiveActiveKey}
      onChange={(key) => effectiveChangeHandler(key)}
      className="bg-white rounded-xl shadow-sm"
      items={[
        {
          key: "overview",
          label: (
            <span className="flex items-center">
              <InfoIcon size={16} className="mr-1" /> Overview
            </span>
          ),
          children: <OverviewTab tournament={tournament} />
        },
        {
          key: "stats",
          label: (
            <span className="flex items-center">
              <BarChart size={16} className="mr-1" /> Statistics
            </span>
          ),
          children: <StatsTab tournament={tournament} />
        },
      ]}
    />
  );
};

export default TournamentTabs; 