import React from "react";
import { Label, Input, FormGroup } from "reactstrap";

export const TextFields = ({ placeholder, type, name , classColMd }) => {
  return (
    <div className={` mt-3 ${classColMd}`}>
        {" "}
        <Input name={name} placeholder={placeholder} type={type} />
    </div>
  );
};
