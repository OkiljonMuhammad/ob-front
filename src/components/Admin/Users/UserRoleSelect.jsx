import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';

const UserRoleSelect = ({ onRoleSelect, roles, initialSelectedRole }) => {
  const [selectedRole, setSelectedRole] = useState(() =>
    roles.find((role) => role.roleName === initialSelectedRole) || null
  );

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

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedRole ? selectedRole.roleName : 'Select a role'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Dropdown.Item key={role.id} onClick={() => handleRoleSelect(role)}>
                {role.roleName}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No roles available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserRoleSelect;
