import React, { useState, useEffect, useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';

const UserRoleSelect = ({ onRoleSelect, roles, initialSelectedRole }) => {
  const [selectedRole, setSelectedRole] = useState(() =>
    roles.find((role) => role.roleName === initialSelectedRole) || null
  );
  const { theme } = useContext(ThemeContext); 
  
  useEffect(() => {
    if (roles.length > 0) {
      const role = roles.find((role) => role.roleName === initialSelectedRole);
      if (role) setSelectedRole(role);
    }
  }, [initialSelectedRole, roles]);
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle 
        variant="primary" 
        id="dropdown-basic">
          {selectedRole ? selectedRole.roleName : 'Select a role'}
        </Dropdown.Toggle>
        <Dropdown.Menu className={`bg-${theme} ${getTextColorClass()}`}>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Dropdown.Item 
              key={role.id} 
              onClick={() => handleRoleSelect(role)}
              className={`bg-${theme} ${getTextColorClass()}`}>
              {role.roleName}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item 
            disabled className={`bg-${theme} ${getTextColorClass()}`}>No roles available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserRoleSelect;
