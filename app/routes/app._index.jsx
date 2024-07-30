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
import eyeIcon from "../assets/image/eye.svg";
import { parse } from "js2xmlparser";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  const shopName = session.shop;
  const productFieldsData = await prisma.ProductFeed.findMany();
  const productData = await prisma.product.findMany();
  return json({ shopName, productFieldsData, data, productData });
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "syncProducts") {
    return await syncProducts(request);
  } else {
    const id = formData.get("id");
    try {
      await prisma.ProductFeed.delete({
        where: { id: Number(id) },
      });
      return redirect("/products");
    } catch (error) {
      return json({ error: "Failed to delete product" }, { status: 500 });
    }
  }
};

async function syncProducts(request) {
  try {
    const { admin, session } = await authenticate.admin(request);

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
      saveProducts(productData),
      upsertImages(imagesData),
      upsertOptions(optionsData),
      upsertVariants(variantsData),
      upsertCollects(collectData),
      upsertCollections(collectionData),
    ]);

    console.log("Sync completed successfully.");
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
  const { shopName, productFieldsData, productData } = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = productFieldsData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(productFieldsData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const submit = useSubmit();
  const handleSync = () => {
    const formData = new FormData();
    formData.append("actionType", "syncProducts");
    submit(formData, { method: "post" });
  };

  const fetcher = useFetcher();
  const handleDelete = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    fetcher.submit(formData, { method: "post" });
  };

  async function handleXML() {
    if (!productData || productData.length === 0) {
      alert("No data found in the database");
      return;
    }

    try {
      const xml = await generateXML(productData);

      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating XML:", error);
    }
  }

  // Generate rows for IndexTable
  const rowMarkup = currentItems.map(({ id, feedName }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
    <IndexTable.Cell>{index + 1}</IndexTable.Cell>
    <IndexTable.Cell>{feedName}</IndexTable.Cell>
      {/* <IndexTable.Cell>{feedName}</IndexTable.Cell>
      <IndexTable.Cell>{feedName}</IndexTable.Cell>
      <IndexTable.Cell>{feedName}</IndexTable.Cell>
      <IndexTable.Cell>{feedName}</IndexTable.Cell> */}
      <IndexTable.Cell>
        <Button type="button" onClick={handleXML}>
          <img src={eyeIcon} alt="Eye Icon" width={15} />
        </Button>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button type="button" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <Header handleSync={handleSync} />
      <div className="mt-4">
        <IndexTable
          itemCount={productFieldsData.length}
          headings={[
            { title: "No" },
            { title: "Name" },
            // { title: "Num. Of Products" },
            // { title: "Status" },
            // { title: "Last Refreshed" },
            // { title: "Feed Url" },
            { title: "View Feed" },
            { title: "Actions" },
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
