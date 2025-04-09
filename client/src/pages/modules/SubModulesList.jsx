import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useParams } from 'react-router-dom';
import ModuleCard from '../../components/modules/ModuleCard';

const SubModulesList = () => {
  const { moduleId, tierId } = useParams();
  
  // Sample modules data for lookup
  const modules = {
    '1': { id: 1, title: 'Module 1' },
    '2': { id: 2, title: 'Module 2' },
    '3': { id: 3, title: 'Module 3' }
  };
  
  // Sample tiers data for lookup
  const tiers = {
    '1': { id: 1, title: 'Tier 1' },
    '2': { id: 2, title: 'Tier 2' },
    '3': { id: 3, title: 'Tier 3' }
  };
  
  // Get the current module and tier
  const currentModule = modules[moduleId] || { title: 'Unknown Module' };
  const currentTier = tiers[tierId] || { title: 'Unknown Tier' };
  
  // Sample sub-modules data organized by module and tier
  const subModules = {
    // Module 1
    '1': {
      // Tier 1
      '1': [
        { id: 1, title: 'Sub-Module 1.1', description: 'User registration functionality', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/1` },
        { id: 2, title: 'Sub-Module 1.2', description: 'User profile management', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/2` }
      ],
      // Tier 2
      '2': [
        { id: 1, title: 'Sub-Module 2.1', description: 'Advanced user search', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/1` },
        { id: 2, title: 'Sub-Module 2.2', description: 'User activity tracking', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/2` },
        { id: 3, title: 'Sub-Module 2.3', description: 'User permissions management', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/3` }
      ],
      // Tier 3
      '3': [
        { id: 1, title: 'Sub-Module 3.1', description: 'Enterprise user controls', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/1` }
      ]
    },
    // Module 2
    '2': {
      // Tier 1
      '1': [
        { id: 1, title: 'Sub-Module 1.1', description: 'Basic reports generation', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/1` },
        { id: 2, title: 'Sub-Module 1.2', description: 'Data visualization tools', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/2` },
        { id: 3, title: 'Sub-Module 1.3', description: 'Export functionality', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/3` }
      ],
      // Tier 2
      '2': [
        { id: 1, title: 'Sub-Module 2.1', description: 'Advanced analytics', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/1` },
        { id: 2, title: 'Sub-Module 2.2', description: 'Custom report builder', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/2` }
      ]
    },
    // Module 3
    '3': {
      // Tier 1
      '1': [
        { id: 1, title: 'Sub-Module 1.1', description: 'Engagement tracking', icon: 'fa-circle', path: `/modules/${moduleId}/tiers/${tierId}/sub-modules/1` }
      ]
    }
  };
  
  // Get sub-modules for the current module and tier
  const currentSubModules = (subModules[moduleId] && subModules[moduleId][tierId]) || [];

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
          <Breadcrumb.Item>
            <Link to={`/modules/${moduleId}`}>{currentModule.title}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{currentTier.title}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mt-4 mb-1">{currentModule.title} - {currentTier.title} - Sub-Modules</h1>
        <p className="text-gray-500">Select a sub-module to access its functionality</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSubModules.map(subModule => (
          <ModuleCard 
            key={subModule.id} 
            id={subModule.id}
            title={subModule.title}
            description={subModule.description}
            icon={subModule.icon}
            path={subModule.path}
          />
        ))}
      </div>
    </div>
  );
};

export default SubModulesList;