import React from "react";
import { Page, LegacyCard, DataTable, Card, Button } from "@shopify/polaris";

export const CustomDataTable = ({ columnType, rows, heading }) => {
  return (
    <div className="mt-3">
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
