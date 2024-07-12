import { Page, Button } from "@shopify/polaris";
import { CustomDataTable, CustomCard , Header } from "./components";

const heading = ["Plan", "Price", "Max Product", "No. of feeds", "Subscribe"];
const columnType = ["text", "numeric", "numeric", "numeric", "numeric"];

const rows = [
  [
    "Enterprise Plan",
    "$150",
    "Unlimited",
    "Unlimited",
    <Button size="large" variant="primary" tone="success">
      Subscribe
    </Button>,
  ],
  [
    "Platinum Plan",
    "$50",
    "10000	",
    "Unlimited",
    <Button size="large" variant="primary" tone="success">
      Subscribe
    </Button>,
  ],
  [
    "Enterprise Plan",
    "$150",
    "Unlimited",
    "Unlimited",
    <Button size="large" variant="primary" tone="success">
      Subscribe
    </Button>,
  ],
];

export default function changePlan() {
  return (
    <Page>
    <Header/>
      <div style={{ marginBottom: "20px" }}>
        <CustomCard
          title="Note"
          leftAccessibility="All the plans have 7days free trial"
        />
      </div>
      <CustomDataTable
        columnType={columnType}
        rows={rows}
        heading={heading}
        title="TEST"
        style={{ marginTop: "20px" }}
      />
    </Page>
  );
}