import React from 'react';
import { Link } from 'react-router-dom';

const ModuleCard = ({ id, title, description, icon, path, count }) => {
  return (
    <Link to={path} className="block">
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:border-[#F97316] transition-all hover:shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
            <i className={`fas ${icon} text-xl`}></i>
          </div>
          {count !== undefined && (
            <span className="bg-[#F3F4F6] text-[#4B5563] text-xs font-medium rounded-full px-2.5 py-1">
              {count}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
};

export default ModuleCard;