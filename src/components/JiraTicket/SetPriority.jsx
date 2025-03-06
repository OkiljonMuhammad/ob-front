import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, Button, Row, Col } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';

const SetPriority = ({ onSetPriority }) => {
  const [priority, setPriority] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const { theme } = useContext(ThemeContext); 

  useEffect(() => {
    setPriority([{name: 'Highest', key: '1'}, 
      {name: 'High', key: '2'},
      {name: 'Medium', key: '3'},
      {name: 'Low', key: '4'},
      {name: 'Lowest', key: '5'},])
  }, []);

  const handlePrioritySelect = (priority) => {
      setSelectedPriority(priority);
      onSetPriority(priority.key); 
  };

  const handleRemovePriority = () => {
    setSelectedPriority(null);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <div className={`bg-${theme} ${getTextColorClass()}`}>
      <Row>
      <Col xs="auto">
         <Dropdown>
           <Dropdown.Toggle variant="primary" id="dropdown-basic">
             {selectedPriority ? selectedPriority.name : 'Select Priority'}
           </Dropdown.Toggle>
           <Dropdown.Menu className={`bg-${theme} ${getTextColorClass()}`}>
             {priority.length > 0 ? (
               priority.map((priority) => (
                 <Dropdown.Item 
                 key={priority.key} 
                 className={`bg-${theme} ${getTextColorClass()}`}
                 onClick={() => handlePrioritySelect(priority)}>
                {priority.name}
                 </Dropdown.Item>
               ))
             ) : (
               <Dropdown.Item 
               className={`bg-${theme} ${getTextColorClass()}`}
               disabled>No priorities available</Dropdown.Item>
             )}
           </Dropdown.Menu>
         </Dropdown>
      </Col>
      <Col xs="auto">
         {selectedPriority ? 
         <Button variant="danger" onClick={handleRemovePriority}>
          Remove
          </Button> : null }
      </Col>
        </Row>
       </div>
  );
};

export default SetPriority;
