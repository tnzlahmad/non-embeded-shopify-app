import shopify from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { IndexTable, ButtonGroup, Button, Page } from "@shopify/polaris";
import { useState } from "react";
import { Header } from "./components";
import prisma from "../db.server";

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  console.log("shopify", shopify);
  console.log("session", session.sh);
  console.log("armughan", "armughan");
  const data = await admin.rest.resources.Product.all({ session });
  return json(data);
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const productTitle = formData.get("productTitle");
  const productImage = formData.get("productImage");

  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
    });

    if (existingProduct) {
      return json({
        success: false,
        error: `Product ${productId} already exists.`,
      });
    }

    const createdProduct = await prisma.product.create({
      data: {
        productId: productId,
        productTitle: productTitle,
        productImage: productImage,
      },
    });

    return json({ success: true, product: createdProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    return json({ success: false, error: error.message });
  }
};

export default function rest() {
  const { data } = useLoaderData();
  const fetcher = useFetcher();
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rowMarkup = currentItems.map(({ image, id, title }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell>
        <img height={"40px"} src={image.src} alt="Product" />
      </IndexTable.Cell>
      <IndexTable.Cell>{id}</IndexTable.Cell>
      <IndexTable.Cell>{title}</IndexTable.Cell>
      <IndexTable.Cell>
        <fetcher.Form method="post">
          <input type="hidden" name="productId" value={id} />
          <input type="hidden" name="productTitle" value={title} />
          <input type="hidden" name="productImage" value={image.src} />
          <Button submit primary>
            Save
          </Button>
        </fetcher.Form>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Page>
        <Header />

        <IndexTable
          itemCount={data.length}
          headings={[{ title: "Image" }, { title: "Id" }, { title: "Title" }]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
        <div className="polaris-btn d-flex justify-content-center mt-3">
          <ButtonGroup segmented>
            <Button
              primary
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous Page
            </Button>
            <span className="space-page">{currentPage} </span>
            <span> / </span> <span className="space-page">{totalPages}</span>
            <Button
              primary
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next Page
            </Button>
          </ButtonGroup>
        </div>
      </Page>
    </>
  );
}
