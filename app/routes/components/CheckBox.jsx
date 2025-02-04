import React from 'react';
import { Label, Input, FormGroup } from 'reactstrap';

export const CheckBox = ({ label, value, name, checked, onChange }) => {
  return (
    <div className="mb-3">
      <FormGroup check>
        <Input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <Label check>{label}</Label>
      </FormGroup>
    </div>
  );
};
