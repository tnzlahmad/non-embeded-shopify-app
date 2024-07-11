import React from "react";
import { Page , Button } from "@shopify/polaris";
import { CustomDataTable, CustomCard , Header } from "./components";

const heading = ["No", " Product match rule", "Assign value", "Overwrite" , "Action"];
const columnType = ["text", "numeric", "numeric", "numeric", "numeric"];

const rows = [
  [
    "",
    "",
    "no Rules available :(",
    "",
    <Button size="large" variant="primary" tone="success">
      Add A New Role
    </Button>,
  ],

];

export default function editGoogle() {
  return (
    <Page>
      <Header />
      <CustomDataTable columnType={columnType} rows={rows} heading={heading} />
      <CustomDataTable columnType={columnType} rows={rows} heading={heading} />
      <CustomDataTable columnType={columnType} rows={rows} heading={heading} />
    </Page>
  );
};

