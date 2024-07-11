import React from "react";
import { Page, TextField, Card } from "@shopify/polaris";
import { Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { Header } from "./components";

const radioOption = [
  {
    question: "Append currency parameter to product URL?",
    options: [
      {
        label:
          "Do Not append. (default, example: my-store.com/products/my-product)",
      },
      {
        label:
          "Do append. (example: my-store.com/products/my-product?currency=USD)",
      },
    ],
  },
  {
    question: "All products or some of them?",
    options: [
      {
        label: "All products",
      },
      {
        label: "Products from selected collection",
      },
    ],
  },
  {
    question: "Export mode",
    options: [
      {
        label: "Export all variants of a product",
      },
      {
        label: "Export only one variant of a product",
      },
    ],
  },
  {
    question: "Use Compare at price:",
    options: [
      {
        label: "Use both 'Compare at price and price' if they exist (default)",
      },
      {
        label:
          "Don't use 'Compare at' price - only the price field from Shopify will be used in the field",
      },
    ],
  },
  {
    question: "Product and variant images",
    options: [
      {
        label:
          "Use variant's image if it exists and fallback to using product's image",
      },
      {
        label: "Always use product's image (and never use variant's image)",
      },
    ],
  },
];

const labelText = [
  { text: "Custom Label 0" },
  { text: "Custom Label 1" },
  { text: "Custom Label 2" },
  { text: "Custom Label 3" },
  { text: "Custom Label 4" },
];

export default function ChangePlan() {
  return (
    <Card sectioned>
      <Page>
        <Header />
        <Container fluid className="mt-4">
          <Row>
            <Col md="9" className="custom-section-left">
              <h2>Add a product feed</h2>
              <div className="d-flex">
                <TextField placeholder="Enter Product Feed Name" />
                <TextField placeholder="Enter Currency (PKR Only)" />
              </div>

              {radioOption.map((section, index) => (
                <div key={index} className="mt-4">
                  <h2>{section.question}</h2>
                  {section.options.map((option, optIndex) => (
                    <FormGroup key={optIndex} check className="mb-2">
                      <Label check>
                        <Input type="radio" name={`question${index}`} />{" "}
                        {option.label}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              ))}

              <h2>Add a product feed</h2>
              <div className="row">
                {labelText.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <TextField fullWidth placeholder={item.text} />
                  </div>
                ))}
              </div>

              <h2>Custom Numbers</h2>
              <div className="d-flex">
                <div className="col-md-6 d-flex">
                  <TextField fullWidth placeholder="test" />
                  <TextField fullWidth placeholder="test" />
                </div>
              </div>


              
            </Col>
            <Col md="3" className="custom-section-right">
              <div>
                <p>This is your right section content.</p>
                <p>This is your right section content.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </Page>
    </Card>
  );
}
