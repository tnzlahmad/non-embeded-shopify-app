import React from "react";
import { Page, LegacyCard, DataTable, Card, Button } from "@shopify/polaris";
import "../_index/styles.module.css";

export const CustomDataTable = ({ columnType, rows, heading, title }) => {
  return (
    <div className="mt-3">
      <Card>
        <Page title={title}>
          <Button size="large" variant="primary" tone="success">Subscribe</Button>
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
