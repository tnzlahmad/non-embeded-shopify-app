import dotenv from "dotenv";
dotenv.config();
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Page,
  Button,
  IndexTable,
  ButtonGroup
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { CustomDataTable, CustomCard, ProductCatalog, FAQsComponent, Header } from "./components";

// Loader function to get the shop name
export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  const shopName = session.shop;
  console.log('data', data);
  return json({ shopName, data });
}

export default function Index() {
  const itemsPerPage = 5;
  const { shopName, data } = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate current items to display based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.data.slice(startIndex, endIndex);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(data.data.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Generate rows for IndexTable
  const rowMarkup = currentItems.map(({ image, id, title }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell><img height={"40px"} src={image.src} alt={title} /></IndexTable.Cell>
      <IndexTable.Cell>{id}</IndexTable.Cell>
      <IndexTable.Cell>{title}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <Header />
      <IndexTable
        itemCount={data.data.length} // Corrected itemCount to reflect the correct length
        headings={[
          { title: 'Image' },
          { title: 'Id' },
          { title: 'Title' },
        ]}
        selectable={false}
      >
        {rowMarkup}
      </IndexTable>

      <div className='polaris-btn'>
        <ButtonGroup segmented>
          <Button primary onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous Page
          </Button>
          <span className='space-page'>{currentPage} / {totalPages}</span>
          <Button primary onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next Page
          </Button>
        </ButtonGroup>
      </div>

      <ProductCatalog />
      <FAQsComponent />
    </Page>
  );
}
