import React, { useState } from "react";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Page, Card } from "@shopify/polaris";
import { Header, TextFields } from "./components";
import { Row, Col } from "reactstrap";
import prisma from "../db.server";
import shopify from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  return json(data);
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const feedName = formData.get("feedName");

  try {
    const productFeed = await prisma.productFeed.create({ data: { feedName } });
    return json({ success: true, product: productFeed });
  } catch (error) {
    console.error("Error saving product feed name:", error);
    return json({ success: false, error: error.message });
  }
};

export default function ChangePlan() {
  const fetcher = useFetcher();
  const [feedName, setFeedName] = useState("");

  const handleSaveClick = async (event) => {
    event.preventDefault();
    const form = document.getElementById("productFeedForm");
    if (form) {
      await fetcher.submit(new FormData(form), { method: "post" });
      setFeedName("");
    }
  };

  return (
    <Page>
      <Header />
      <div className="mt-4">
        <Card>
          <form id="productFeedForm">
            <Row>
              <Col md="9">
                <h5>Add a product feed</h5>
                <TextFields
                  placeholder="Enter Product Feed Name"
                  name="feedName"
                  required
                  value={feedName}
                  onChange={(e) => setFeedName(e.target.value)}
                />
              </Col>
              <Col md="3">
                <div className="d-flex flex-column justify-content-end h-100">
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="btn btn-primary mt-3"
                  >
                    Create Feed
                  </button>
                </div>
              </Col>
            </Row>
          </form>
        </Card>
      </div>
    </Page>
  );
}
