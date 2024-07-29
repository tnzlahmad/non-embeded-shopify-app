import React from "react";
import shopify from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { Page, Card, Text, Button } from "@shopify/polaris";
import { Header, TextFields, CheckBox, SelectBox } from "./components";
import { Row, Col } from "reactstrap";
import prisma from "../db.server";

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  return json(data);
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const feedName = formData.get("feedName");
  try {
    const existingProduct = await prisma.productFields.create({
      data: {
        feedName,
      },
    });

    return json({ success: true, product: existingProduct });
  } catch (error) {
    console.error("Error saving product feed name:", error);
    return json({ success: false, error: error.message });
  }
};

export default function ChangePlan() {
  const fetcher = useFetcher();

  const handleSaveClick = (event) => {
    event.preventDefault();
    const form = document.getElementById("productFeedForm");
    if (form instanceof HTMLFormElement) {
      fetcher.submit(new FormData(form), { method: "post" });
    } else {
      console.error("Form element not found or not of type HTMLFormElement");
    }
  };

  return (
    <Page>
      <Header />
      <div className="mt-4">
        <Card>
          <form id="productFeedForm">
            <Row>
              {/* Left Section */}
              <Col md="9">
                {/* TextField */}
                <div className="row">
                  <Text as="h4" variant="headingLg">
                    Add a product feed
                  </Text>
                  <TextFields
                    placeholder="Enter Product Feed Name"
                    type="text"
                    name="feedName"
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
            <button type="button" onClick={handleSaveClick} className="btn btn-primary mt-3">Save</button>
          </form>
        </Card>
      </div>
    </Page>
  );
}
