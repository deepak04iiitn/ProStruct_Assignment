import React from 'react';

function MapLegend({ roleIcons, projectRoles }) {
  return (
    <div className="absolute bottom-5 right-5 bg-white p-3 rounded shadow-md z-10">
      <h4 className="text-sm font-bold mt-0 mb-2">Project Roles</h4>
      {projectRoles.map(role => {
        const iconConfig = roleIcons[role];
        if (!iconConfig) return null;
        
        return (
          <div key={role} className="flex items-center mb-1">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: iconConfig.color }}
            />
            <span className="text-sm">{role}</span>
          </div>
        );
      })}
    </div>
  );
}

export default MapLegend;