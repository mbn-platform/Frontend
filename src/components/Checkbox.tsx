import React, { memo } from 'react';
import { Col } from 'reactstrap';

interface CheckboxProps {
  checked: boolean,
  title: string,
  onToggle: (checked: boolean) => void,
};

const Checkbox: React.FC<CheckboxProps> = ({ checked, title, onToggle }) => {
  const onChange = () => {
    onToggle(!checked);
  };

  return (
    <Col className='checkbox' xs='auto'>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        {title}
      </label>
    </Col>
  );
};

export default memo(Checkbox);
