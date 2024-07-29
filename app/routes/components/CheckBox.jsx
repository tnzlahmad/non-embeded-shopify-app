import React, { useState } from "react";
import { Label, Input, FormGroup } from "reactstrap";

export const CheckBox = ({ labelOne, labelTwo, title, name }) => {
  return (
    <>
      <h1 className="mb-3">{title}</h1>
      <div className="mb-3">
        <FormGroup check>
          <Input name={name} type="radio" /> <Label check>{labelOne}</Label>
        </FormGroup>
        <FormGroup check>
          <Input name={name} type="radio" /> <Label check>{labelTwo}</Label>
        </FormGroup>
      </div>
    </>
  );
};
