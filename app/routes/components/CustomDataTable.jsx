import React from "react";
import { Page, LegacyCard, DataTable, Card, Button } from "@shopify/polaris";

export const CustomDataTable = ({ columnType, rows, heading }) => {
  return (
    <div style={{ marginTop: "25px" }}>
      <Card>
        <Page title="Products Feed">
          <DataTable
            columnContentTypes={columnType}
            headings={heading}
            rows={rows}
          />
        </Page>
      </Card>
    </div>
  );
};
