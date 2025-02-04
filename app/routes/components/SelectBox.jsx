import React from "react";
import { FormGroup, Input } from "reactstrap";

export const SelectBox = ({ classColMd, options, name }) => {
  return (
    <div className={`${classColMd}`}>
      <FormGroup>
        <Input name={name} type="select">
          <option value="">Please Select an Option</option>
          {options.map((option) => (
            <option key={option.id} value={option.title}>
              {option.title}
            </option>
          ))}
        </Input>
      </FormGroup>
    </div>
  );
};
