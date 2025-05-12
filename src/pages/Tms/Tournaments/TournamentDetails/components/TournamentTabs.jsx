import { useState } from "react";
import { Tabs } from "antd";
import { InfoIcon } from "../components/Icons";
import { BarChart } from "../components/Icons";
import OverviewTab from "./OverviewTab";
import StatsTab from "./StatsTab";

const TournamentTabs = ({ tournament }) => {
  const [activeKey, setActiveKey] = useState("overview");
  
  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
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