import React from "react";
import { Page, LegacyCard, DataTable, Card, Button } from "@shopify/polaris";

export const CustomDataTable = ({ columnType, rows, heading }) => {
  return (
    <div style={{ marginTop: "25px" }}>
      <Card>
        <Page title="Products Feed">
          <LegacyCard>
            <DataTable
              columnContentTypes={columnType}
              headings={heading}
              rows={rows}
            />
          </LegacyCard>
        </Page>
      </Card>
    </div>
  );
};
