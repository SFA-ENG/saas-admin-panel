import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useParams } from 'react-router-dom';
import ModuleCard from '../../components/modules/ModuleCard';

const TiersList = () => {
  const { moduleId } = useParams();
  
  // Sample modules data for lookup
  const modules = {
    '1': { id: 1, title: 'Module 1', description: 'Primary module for core operations' },
    '2': { id: 2, title: 'Module 2', description: 'Analytics and reporting features' },
    '3': { id: 3, title: 'Module 3', description: 'User engagement tools' }
  };
  
  // Get the current module
  const currentModule = modules[moduleId] || { title: 'Unknown Module', description: 'Module not found' };
  
  // Sample tiers data for the selected module
  const tiersByModule = {
    '1': [
      { id: 1, title: 'Tier 1', description: 'Basic functionality tier', icon: 'fa-layer-group', path: `/modules/${moduleId}/tiers/1`, count: 2 },
      { id: 2, title: 'Tier 2', description: 'Advanced features tier', icon: 'fa-layer-group', path: `/modules/${moduleId}/tiers/2`, count: 3 },
      { id: 3, title: 'Tier 3', description: 'Premium functionality tier', icon: 'fa-layer-group', path: `/modules/${moduleId}/tiers/3`, count: 1 }
    ],
    '2': [
      { id: 1, title: 'Tier 1', description: 'Basic analytics tier', icon: 'fa-layer-group', path: `/modules/${moduleId}/tiers/1`, count: 3 },
      { id: 2, title: 'Tier 2', description: 'Advanced reporting tier', icon: 'fa-layer-group', path: `/modules/${moduleId}/tiers/2`, count: 2 }
    ],
    '3': [
      { id: 1, title: 'Tier 1', description: 'User management tier', icon: 'fa-layer-group', path: `/modules/${moduleId}/tiers/1`, count: 1 }
    ]
  };
  
  // Get tiers for the current module
  const tiers = tiersByModule[moduleId] || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/modules">Modules</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{currentModule.title}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mt-4 mb-1">{currentModule.title} - Tiers</h1>
        <p className="text-gray-500">Select a tier to view its sub-modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map(tier => (
          <ModuleCard 
            key={tier.id} 
            id={tier.id}
            title={tier.title}
            description={tier.description}
            icon={tier.icon}
            path={tier.path}
            count={tier.count}
          />
        ))}
      </div>
    </div>
  );
};

export default TiersList;