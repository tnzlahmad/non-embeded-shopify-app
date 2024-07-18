import React from "react";
import { Label, Input, FormGroup } from "reactstrap";

const options = [1, 2, 3, 4, 5];

export const SelectBox = ({ title, classColMd }) => {
  return (
    <div className={`${classColMd}`}>
      <FormGroup>
        <Label for="testSelect">{title}</Label>
        <Input id="testSelect" name="select" type="select">
          <option value="">Please Select an Option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Input>
      </FormGroup>
    </div>
  );
};

// Usage example
// <SelectBox title="Select" />
