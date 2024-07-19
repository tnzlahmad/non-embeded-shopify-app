// import dotenv from "dotenv";
// dotenv.config();
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData , useSubmit } from "@remix-run/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Page, Button, IndexTable, ButtonGroup } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {saveProducts} from "../utitls/product.server";
import {
  CustomDataTable,
  CustomCard,
  ProductCatalog,
  FAQsComponent,
  Header,
} from "./components";
import prisma from "../db.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  const shopName = session.shop;
  const productFieldsData = await prisma.productFields.findMany();
  return json({ shopName, productFieldsData, data });
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "syncProducts") {
    return await syncProducts(request);
  } else {
    const id = formData.get("id");
    try {
      await prisma.productFields.delete({
        where: { id: Number(id) },
      });
      return redirect("/products");
    } catch (error) {
      return json({ error: "Failed to delete product" }, { status: 500 });
    }
  }
};

async function syncProducts(request) {
  const { admin, session } = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  await saveProducts(data.data);
  return json({ message: "Products synced successfully" });
}

export default function Index() {
  const itemsPerPage = 5;
  const { shopName, productFieldsData } = useLoaderData();
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

  // Generate rows for IndexTable
  const rowMarkup = currentItems.map(({ image, id, feedName }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell>
        {image ? (
          <img height={"40px"} src={image.src} alt={title} />
        ) : (
          <span>No Image</span>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>{id}</IndexTable.Cell>
      <IndexTable.Cell>{feedName}</IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button>Edit</Button>
          <Button type="button" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <Header />

      <Button onClick={handleSync}>Sync</Button>

      <IndexTable
        itemCount={productFieldsData.length}
        headings={[
          { title: "Image" },
          { title: "Id" },
          { title: "Title" },
          { title: "Action" },
        ]}
        selectable={false}
      >
        {rowMarkup}
      </IndexTable>

      <div className="polaris-btn mt-3">
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
