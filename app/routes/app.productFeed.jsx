import React, { useState, useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, Banner } from "@shopify/polaris";
import { Header, TextFields } from "./components";
import { Row, Col } from "reactstrap";
import prisma from "../db.server";
import shopify from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  return json({ data, shopName: session.shop });
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const feedName = formData.get("feedName");
  const shopName = formData.get("shopName");

  if (!feedName.trim()) {
    return json({
      success: false,
      error: "Product feed name cannot be empty.",
    });
  }

  try {
    const existingFeed = await prisma.productFeed.findUnique({
      where: { feedName },
    });

    if (existingFeed) {
      return json({
        success: false,
        error: "This feed name is already in use. Please choose another.",
      });
    }

    const productFeed = await prisma.productFeed.create({
      data: { feedName, shopName },
    });

    return redirect("/app");
  } catch (error) {
    console.error("Error saving product feed name:", error);
    return json({ success: false, error: error.message });
  }
};

export default function ChangePlan() {
  const { shopName } = useLoaderData();
  const fetcher = useFetcher();
  const [feedName, setFeedName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (fetcher.data) {
      const { success, error } = fetcher.data;
      if (success) {
        setMessage({
          text: "Product feed created successfully!",
          type: "success",
        });
        setFeedName("");
      } else {
        setMessage({
          text: error || "An error occurred. Please try again.",
          type: "critical",
        });
      }
    }
  }, [fetcher.data]);

  const handleSaveClick = (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById("productFeedForm"));
    formData.set("shopName", shopName);
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <Page>
      <Header />
      <div className="mt-4">
        <Card>
          {message.text && (
            <Banner
              title={message.type === "success" ? "Success" : "Error"}
              status={message.type}
            >
              {message.text}
            </Banner>
          )}
          <form id="productFeedForm" className="mt-2">
            <h5>Add a product feed</h5>
            <TextFields
              placeholder="Enter Product Feed Name"
              name="feedName"
              required
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
            />
            <TextFields name="shopName" value={shopName} type="hidden" />
            <button
              type="button"
              onClick={handleSaveClick}
              className="btn btn-success w-100"
            >
              Create Feed
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
}
