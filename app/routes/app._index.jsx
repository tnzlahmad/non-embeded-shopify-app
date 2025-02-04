// import dotenv from "dotenv";
// dotenv.config();
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Page, Button, IndexTable, ButtonGroup } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {
  saveProducts,
  upsertImages,
  upsertOptions,
  upsertVariants,
  upsertCollects,
  upsertCollections,
} from "../utitls/product.server";
import { ProductCatalog, FAQsComponent, Header } from "./components";
import prisma from "../db.server";
import generateIcon from "../assets/image/generate.icon.svg";
import { parse } from "js2xmlparser";

// Data Get From Database + Live
export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  const shopName = session.shop;
  const productFeedsData = await prisma.productFeed.findMany();
  const productData = await prisma.product.findMany();
  const collecData = await prisma.collect.findMany();
  const collectionData = await prisma.collections.findMany();
  const variants = await prisma.variants.findMany();
  const options = await prisma.options.findMany();
  const images = await prisma.images.findMany();
  return json({
    shopName,
    productFeedsData,
    data,
    productData,
    collecData,
    collectionData,
    variants,
    options,
    images,
  });
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "syncProducts") {
    return await syncProducts(request);
  }

  return json({ error: "Invalid action type" }, { status: 400 });
};

// Product Sync
async function syncProducts(request) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shopName = session.shop;
    const [productResponse, collectResponse, collectionResponse] =
      await Promise.all([
        admin.rest.resources.Product.all({ session }),
        admin.rest.resources.Collect.all({ session }),
        admin.rest.resources.CustomCollection.all({ session }),
      ]);

    const productData = productResponse.data || [];
    const collectData = collectResponse.data || [];
    const collectionData = collectionResponse.data || [];

    const imagesData = productData.flatMap((product) => product.images || []);
    const optionsData = productData.flatMap((product) => product.options || []);
    const variantsData = productData.flatMap(
      (product) => product.variants || [],
    );

    await Promise.all([
      saveProducts(productData, shopName),
      upsertImages(imagesData),
      upsertOptions(optionsData),
      upsertVariants(variantsData),
      upsertCollects(collectData),
      upsertCollections(collectionData),
    ]);

    return { success: true, message: "Sync completed successfully" };
  } catch (error) {
    console.error("Error syncing products:", error);
    return {
      success: false,
      message: "Error syncing products",
      error: error.message,
    };
  }
}

// Generate XML Function
async function generateXML(products) {
  try {
    const xml = parse("Products", { Product: products });
    return xml;
  } catch (error) {
    console.error("Error generating XML:", error);
    throw error;
  }
}

export default function Index() {
  const itemsPerPage = 5;
  const {
    shopName,
    productFeedsData,
    productData,
    collecData,
    collectionData,
    variants,
    options,
    images,
  } = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredProductFeeds = productFeedsData.filter(
    (item) => item.shopName === shopName,
  );
  const currentItems = filteredProductFeeds.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProductFeeds.length / itemsPerPage);

  const handleDelete = async (feedName) => {
    try {
      const response = await fetch("/delete-feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ actionType: "deleteFeed", feedName }),
      });
      const result = await response.json();

      if (result.success) {
        alert("Product feed deleted successfully");
        window.location.reload();
      } else {
        alert(result.message || "Failed to delete product feed");
      }
    } catch (error) {
      console.error("Error deleting product feed:", error);
      alert("Failed to delete product feed");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const submit = useSubmit();
  const handleSync = () => {
    const formData = new FormData();
    formData.append("actionType", "syncProducts");
    submit(formData, { method: "post" });
  };

  async function handleXML(feedName, shopName) {
    console.log("handleXML", productData);
    if (!productData?.length) {
      alert("No data found in the database");
      return;
    }

    const sanitizeFeedName = (name) =>
      typeof name === "string" ? name.replace(/\s+/g, "") : "defaultFeedName";

    const createFilename = (feedName) => {
      return `${new Date().toISOString().replace(/[-:.T]/g, "")}_${sanitizeFeedName(feedName)}.xml`;
    };

    const getProductDetails = (productId) => {
      const productImages = images.filter(
        (image) => image.productId === productId,
      );
      const productOptions = options.filter(
        (option) => option.productId === productId,
      );
      const productVariants = variants.filter(
        (variant) => variant.productId === productId,
      );

      return {
        images: productImages,
        options: productOptions,
        variants: productVariants,
      };
    };

    const generateEnrichedProducts = () =>
      productData
        .filter((product) => product.shopName === shopName)
        .map((product) => {
          const { images, options, variants } = getProductDetails(
            product.productId,
          );

          return {
            ...product,
            images,
            options,
            variants,
            collections: collecData
              .filter((collect) => collect.productId === product.productId)
              .map((collect) => ({
                collectData: { ...collect },
                collectionDetails:
                  collectionData.find(
                    (col) => col.collectionId === collect.collectionId,
                  ) || {},
              })),
          };
        });

    try {
      const xml = await generateXML(generateEnrichedProducts());
      const xmlFilename = createFilename(feedName);

      const formData = new FormData();
      formData.append("actionType", "saveXML");
      formData.append("xmlData", xml);
      formData.append("feedName", feedName);
      formData.append("filename", xmlFilename);

      const formDataEntries = Array.from(formData.entries());
      console.log("FormData entries:-----------------", formDataEntries);

      const saveResponse = await fetch("/save-xml", {
        method: "POST",
        body: formData,
      });

      if (!saveResponse.ok) {
        // Log the error response for better debugging
        const errorText = await saveResponse.text();
        console.error("Error response from save-xml:0---------", errorText);
        throw new Error("Failed to save XML file");
      }

      const saveResult = await saveResponse.json();
      console.log("🚀 ~ handleXML ~ saveResult:--------", saveResult);

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save XML file");
      }

      // Get the updated feed URL after saving the XML
      const updatedFeedURL = saveResult.url;

      // Log the URL to the console
      console.log("Generated XML Feed URL:", updatedFeedURL);

      const updateResponse = await fetch("/update-feed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedName,
          productFeedURL: updatedFeedURL,
        }),
      });

      const updateResult = await updateResponse.json();

      if (updateResult.success) {
        alert("Product feed URL updated successfully");

        // Refresh the row or the list after the update
        // You can fetch the latest data or update the URL directly if possible
        currentItems = currentItems.map((item) =>
          item.feedName === feedName
            ? { ...item, productFeedURL: updatedFeedURL }
            : item,
        );
        window.location.reload();
      } else {
        throw new Error(
          updateResult.error || "Failed to update product feed URL",
        );
      }
    } catch (error) {
      console.error("Error generating, saving, or updating XML:", error);
      alert("Failed to save XML file or update feed URL");
    }
  }

  // Generate rows for IndexTable
  const rowMarkup = currentItems.map(
    ({ id, feedName, productFeedURL }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>{index + 1}</IndexTable.Cell>
        <IndexTable.Cell>{feedName}</IndexTable.Cell>
        <IndexTable.Cell>
          {productFeedURL ? (
            <a href={productFeedURL} target="_blank" rel="noopener noreferrer">
              {productFeedURL.length > 30
                ? `${productFeedURL.slice(0, 30)}...`
                : productFeedURL}
            </a>
          ) : (
            "No Product Feed URL"
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button type="button" onClick={() => handleXML(feedName, shopName)}>
            <img src={generateIcon} alt="Generate Icon" width={15} />
          </Button>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button type="button" onClick={() => handleDelete(feedName)}>
              Delete
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page>
      <Header handleSync={handleSync} />
      <div className="mt-4">
        <IndexTable
          itemCount={productFeedsData.length}
          headings={[
            { title: "No" },
            { title: "Name" },
            { title: "Feed Url" },
            { title: "Generate Feed" },
            { title: "Delete" },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </div>

      <div className="polaris-btn mt-3 d-flex justify-content-center">
        <ButtonGroup segmented>
          <Button
            primary
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous Page
          </Button>
          <span className="space-page">
            {currentPage} / {totalPages}
          </span>
          <Button
            primary
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next Page
          </Button>
        </ButtonGroup>
      </div>
      <ProductCatalog />
      <FAQsComponent />
    </Page>
  );
}
