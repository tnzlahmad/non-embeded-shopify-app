import React, { useState } from "react";
import { Container, FormGroup, Label, Input } from "reactstrap";
import { Page, Layout, Card, Button } from "@shopify/polaris";
import { Header } from "./components";

const editSettings = () => {
  return (
    <Page>
      <Header />
      <div className="mt-4">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div style={{ marginBottom: "20px" }}>
              <h1>Global Settings</h1>
              <h3>Tax Settings</h3>
            </div>
            <Container>
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="option" />
                  Do NOT add tax prices
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="option" />
                  Do add tax to prices - set tax rate below
                </Label>
              </FormGroup>
              <FormGroup
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ width: "48%" }}>
                  <Label for="text1">
                    Tax rate percent (example: if the tax rate is 22%, enter 22)
                  </Label>
                  <Input
                    type="text"
                    id="text1"
                    placeholder="Add Tax Percentage%"
                  />
                </div>
                <div style={{ width: "48%" }}>
                  <Label for="text2">
                    Round & format prices to this number of decimal places
                    (default: 2)
                  </Label>
                  <Input
                    type="text"
                    id="text2"
                    placeholder="Tax Decimal Places"
                  />
                </div>
              </FormGroup>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button primary>Update Settings</Button>
              </div>
            </Container>
          </Card>
        </Layout.Section>
      </Layout>
      </div>
    </Page>
  );
};

export default editSettings;
