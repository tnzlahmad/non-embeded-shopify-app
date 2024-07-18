import React from "react";
import { Page, Card , Text } from "@shopify/polaris";
import { Row, Col } from "reactstrap";
import { Header, TextFields, CheckBox, SelectBox } from "./components";

export default function ChangePlan() {
  return (
    <Page>
      <Header />
      <div className="mt-4">
        <Card>
          <Row>
            {/* Left Section */}
            <Col md="9">
              {/* TextField */}
              <div className="row">
              <Text as="h4" variant="headingLg">Add a product feed</Text>
                <TextFields
                  placeholder="Enter Product Feed Name"
                  type="text"
                  name=""
                  classColMd="col-md-6"
                />
                <TextFields
                  placeholder="Enter Currency (PKR Only)"
                  type="text"
                  name=""
                  classColMd="col-md-6"
                />
              </div>

              {/* CheckBox */}
              <div className="mt-3">
              <h5>Append currency parameter to product URL?</h5>
                <CheckBox
                  labelOne="Do Not append. (default, example: my-store.com/products/my-product)"
                  labelTwo="Do append. (example: my-store.com/products/my-product?currency=USD)"
                  name="CheckBox1"
                />
              </div>
              <div className="mt-3">
              <h5>All products or some of them?</h5>
                <CheckBox
                  labelOne="All products"
                  labelTwo="Products from selected collection"
                  name="CheckBox2"
                />
              </div>
              {/* Text Box */}
              <div className="row">
                <h5>Another Text Box</h5>
                <TextFields
                  placeholder="Text Field"
                  type="text"
                  name=""
                  classColMd="col-md-6"
                />
                <TextFields
                  placeholder="Text Field"
                  type="text"
                  name=""
                  classColMd="col-md-6"
                />
              </div>

              {/* Select Box */}
              <div className="row mt-3">
              <h5>Select Box</h5>
              <SelectBox classColMd="col-md-12" />
              </div>
            </Col>

            {/* Right Section */}
            <Col md="3">
              <div>
                <p>This is your right section content.</p>
                <p>This is your right section content.</p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </Page>
  );
}
