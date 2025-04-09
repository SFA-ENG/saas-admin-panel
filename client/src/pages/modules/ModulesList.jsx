import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import ModuleCard from '../../components/modules/ModuleCard';

const ModulesList = () => {
  // Sample module data
  const modules = [
    {
      id: 1,
      title: 'Module 1',
      description: 'Primary module for core operations',
      icon: 'fa-cube',
      path: '/modules/1',
      count: 3
    },
    {
      id: 2,
      title: 'Module 2',
      description: 'Analytics and reporting features',
      icon: 'fa-chart-pie',
      path: '/modules/2',
      count: 2
    },
    {
      id: 3,
      title: 'Module 3',
      description: 'User engagement tools',
      icon: 'fa-users',
      path: '/modules/3',
      count: 1
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Modules</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mt-4 mb-1">Modules</h1>
        <p className="text-gray-500">Select a module to explore its tiers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => (
          <ModuleCard 
            key={module.id} 
            id={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            path={module.path}
            count={module.count}
          />
        ))}
      </div>
    </div>
  );
};

export default ModulesList;