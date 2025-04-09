import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Academy = () => {
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);

  // Fetch academy data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/academy'],
    enabled: false, // Disable actual fetch for now since we're using state
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Academy</h1>
        <p className="text-[#6B7280]">Manage your academy programs and coaching staff</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-user-graduate text-[#6366F1]"></i>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>
          <h3 className="font-semibold mb-1">Students</h3>
          <p className="text-sm text-[#6B7280] mb-4">342 students enrolled across all programs</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-user-tie text-[#6366F1]"></i>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>
          <h3 className="font-semibold mb-1">Coaches</h3>
          <p className="text-sm text-[#6B7280] mb-4">24 coaches currently assigned to programs</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <i className="fas fa-book text-[#6366F1]"></i>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>
          <h3 className="font-semibold mb-1">Programs</h3>
          <p className="text-sm text-[#6B7280] mb-4">8 active training programs</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Academy Programs</h2>
        <button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded">
          Add Program
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        {isLoading ? (
          <p>Loading programs...</p>
        ) : programs && programs.length > 0 ? (
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Program Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Coaches</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Program rows would go here */}
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-[#6B7280]">No programs available</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[#6B7280] mb-4">No academy programs at the moment</p>
            <button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded">Create Your First Program</button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coaching Staff</h2>
        <button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded">
          Add Coach
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        {isLoading ? (
          <p>Loading coaches...</p>
        ) : coaches && coaches.length > 0 ? (
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Coach rows would go here */}
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-[#6B7280]">No coaches available</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[#6B7280] mb-4">No coaches added yet</p>
            <button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded">Add Your First Coach</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academy;
