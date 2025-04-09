import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Settings</h1>
        <p className="text-[#6B7280]">Manage your application settings</p>
      </div>
      
      <div className="flex border-b border-[#E5E7EB] mb-6">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'general' ? 'text-[#6366F1] border-b-2 border-[#6366F1]' : 'text-[#6B7280]'}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'account' ? 'text-[#6366F1] border-b-2 border-[#6366F1]' : 'text-[#6B7280]'}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'notifications' ? 'text-[#6366F1] border-b-2 border-[#6366F1]' : 'text-[#6B7280]'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'security' ? 'text-[#6366F1] border-b-2 border-[#6366F1]' : 'text-[#6B7280]'}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'general' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#111827] mb-1">Application Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-[#E5E7EB] rounded-md"
                placeholder="SportsAdmin Pro"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#111827] mb-1">Organization Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-[#E5E7EB] rounded-md"
                placeholder="Your Organization"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#111827] mb-1">Default Language</label>
              <select className="w-full p-2 border border-[#E5E7EB] rounded-md">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#111827] mb-1">Timezone</label>
              <select className="w-full p-2 border border-[#E5E7EB] rounded-md">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>CST (Central Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
              </select>
            </div>
            
            <button className="bg-[#6366F1] text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        )}
        
        {activeTab === 'account' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <p className="text-[#6B7280]">Manage your account information</p>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
            <p className="text-[#6B7280]">Configure how you receive notifications</p>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <p className="text-[#6B7280]">Manage your security preferences</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
