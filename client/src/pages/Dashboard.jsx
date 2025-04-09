import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import ActionCard from "../components/dashboard/ActionCard";
import ActivityItem from "../components/dashboard/ActivityItem";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      icon: "fas fa-trophy",
      title: "Tournaments",
      description: "12 active tournaments with 156 teams participating",
      status: "ACTIVE",
      actionText: "Manage",
      viewText: "View"
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Academy",
      description: "24 coaches, 8 programs, 342 students enrolled",
      status: "ACTIVE",
      actionText: "Manage",
      viewText: "View"
    },
    {
      icon: "fas fa-chart-line",
      title: "SFA Next",
      description: "5 development programs, 3 initiatives in progress",
      status: "IN PROGRESS",
      actionText: "Manage",
      viewText: "View"
    },
    {
      icon: "fas fa-campground",
      title: "Sports Camps",
      description: "4 upcoming camps, 120 registrations pending",
      status: "UPCOMING",
      actionText: "Manage",
      viewText: "View"
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      icon: "fas fa-trophy",
      title: "Tournament 'Summer League' created",
      user: "Admin",
      time: "Today, 10:45 AM"
    },
    {
      id: 2,
      icon: "fas fa-user",
      title: "New coach added to Basketball Academy",
      user: "Manager",
      time: "Today, 09:30 AM"
    },
    {
      id: 3,
      icon: "fas fa-calendar",
      title: "Sports Camp 'Junior Athletics' scheduled",
      user: "Admin",
      time: "Yesterday, 04:15 PM"
    },
    {
      id: 4,
      icon: "fas fa-file-alt",
      title: "SFA Next program 'Youth Development' updated",
      user: "Manager",
      time: "Yesterday, 02:20 PM"
    },
    {
      id: 5,
      icon: "fas fa-user-tag",
      title: "New user role 'Regional Manager' created",
      user: "Admin",
      time: "Yesterday, 11:05 AM"
    }
  ]);

  const [actions, setActions] = useState([
    {
      icon: "fas fa-plus",
      title: "New Tournament",
      description: "Create and set up a new tournament",
      actionText: "Create"
    },
    {
      icon: "fas fa-user-plus",
      title: "Add User",
      description: "Create new user account with role",
      actionText: "Add"
    },
    {
      icon: "fas fa-calendar-plus",
      title: "Schedule Camp",
      description: "Set up a new sports camp event",
      actionText: "Schedule"
    },
    {
      icon: "fas fa-chart-bar",
      title: "Reports",
      description: "Generate analytics and reports",
      actionText: "Generate"
    }
  ]);

  // Fetch dashboard data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: false, // Disable actual fetch for now since we're using state
  });

  const handleActionClick = (action) => {
    console.log("Action clicked:", action);
    // Handle action click logic
  };

  const handleViewActivity = (activity) => {
    console.log("View activity:", activity);
    // Handle view activity logic
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Welcome back, John</h1>
        <p className="text-[#6B7280]">Here's what's happening across your sports programs today</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Recent Activity Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <a href="#" className="text-sm text-[#F97316]">View All</a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {activities.map((activity) => (
            <ActivityItem 
              key={activity.id}
              icon={activity.icon}
              title={activity.title}
              user={activity.user}
              time={activity.time}
              onView={() => handleViewActivity(activity)}
            />
          ))}
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <ActionCard 
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              actionText={action.actionText}
              onClick={() => handleActionClick(action)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
