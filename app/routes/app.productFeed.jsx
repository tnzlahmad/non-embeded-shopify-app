import React from "react";
import { Page, Card } from "@shopify/polaris";
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
                <h1>Add a product feed</h1>
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
                <CheckBox
                  title="Append currency parameter to product URL?"
                  labelOne="Do Not append. (default, example: my-store.com/products/my-product)"
                  labelTwo="Do append. (example: my-store.com/products/my-product?currency=USD)"
                  name="CheckBox1"
                />
              </div>
              <div className="mt-3">
                <CheckBox
                  title="All products or some of them?"
                  labelOne="All products"
                  labelTwo="Products from selected collection"
                  name="CheckBox2"
                />
              </div>
              {/* Text Box */}
              <div className="row">
                <h1>Another Text Box</h1>
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
              <SelectBox title="Select Box" classColMd="col-md-12" />
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
