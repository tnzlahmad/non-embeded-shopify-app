// import dotenv from "dotenv";
// dotenv.config();
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Page, Button, IndexTable, ButtonGroup } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { saveProducts } from "../utitls/product.server";
import { ProductCatalog, FAQsComponent, Header } from "./components";
import prisma from "../db.server";
import eyeIcon from "../assets/image/eye.svg";
import { parse } from "js2xmlparser";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.all({ session });
  const shopName = session.shop;
  const productFieldsData = await prisma.productFields.findMany();
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
  try {
    const { admin, session } = await authenticate.admin(request);
    const data = await admin.rest.resources.Product.all({ session });
    const collectData = await admin.rest.resources.Collect.all({ session });
    const collections = await admin.rest.resources.CustomCollection.all({ session });

    await saveProducts(data.data);

    const upsertPromises = [];

    const images = data.data.flatMap(product => product.images);
    images.forEach(image => {
      upsertPromises.push(
        prisma.images.upsert({
          where: { imageId: image.id.toString() },
          update: {
            shopifyId: image.product_id.toString(),
            imageId: image.id.toString(),
            createdAt: new Date(image.created_at),
            height: image.height.toString(),
            position: image.position.toString(),
            src: image.src,
            updatedAt: new Date(image.updated_at),
            variantIds: image.variant_ids.length ? image.variant_ids.join(",") : null,
            width: image.width.toString(),
            alt: image.alt || "",
            adminGraphqlApiId: image.admin_graphql_api_id,
          },
          create: {
            shopifyId: image.product_id.toString(),
            imageId: image.id.toString(),
            createdAt: new Date(image.created_at),
            height: image.height.toString(),
            position: image.position.toString(),
            src: image.src,
            updatedAt: new Date(image.updated_at),
            variantIds: image.variant_ids.length ? image.variant_ids.join(",") : null,
            width: image.width.toString(),
            alt: image.alt || "",
            adminGraphqlApiId: image.admin_graphql_api_id,
          },
        }).catch(error => console.error("Error saving image:", error))
      );
    });

    const options = data.data.flatMap(product => product.options);
    options.forEach(option => {
      upsertPromises.push(
        prisma.options.upsert({
          where: { optionId: option.id.toString() },
          update: {
            shopifyId: option.product_id.toString(),
            optionId: option.id.toString(),
            name: option.name,
            position: option.position.toString(),
            values: option.values.join(","),
          },
          create: {
            shopifyId: option.product_id.toString(),
            optionId: option.id.toString(),
            name: option.name,
            position: option.position.toString(),
            values: option.values.join(","),
          },
        }).catch(error => console.error("Error upserting option:", error))
      );
    });

    const variants = data.data.flatMap(product => product.variants);
    variants.forEach(variant => {
      upsertPromises.push(
        prisma.variants.upsert({
          where: { variantsId: variant.id.toString() },
          update: {
            productId: variant.product_id.toString(),
            variantsId: variant.id.toString(),
            barcode: variant.barcode || null,
            compareAtPrice: variant.compare_at_price || null,
            createdAt: new Date(variant.created_at),
            fulfillmentService: variant.fulfillment_service,
            grams: variant.grams.toString(),
            imageId: variant.image_id || null,
            inventoryItemId: variant.inventory_item_id.toString(),
            inventoryManagement: variant.inventory_management || null,
            inventoryPolicy: variant.inventory_policy,
            inventoryQuantity: variant.inventory_quantity.toString(),
            oldInventoryQuantity: variant.old_inventory_quantity.toString(),
            position: variant.position.toString(),
            price: variant.price.toString(),
            requiresShipping: variant.requires_shipping,
            sku: variant.sku || null,
            taxable: variant.taxable,
            title: variant.title,
            updatedAt: new Date(variant.updated_at),
            weight: variant.weight.toString(),
            weight_unit: variant.weight_unit,
            option1: variant.option1,
            option2: variant.option2 || null,
            option3: variant.option3 || null,
            adminGraphqlApiId: variant.admin_graphql_api_id,
          },
          create: {
            productId: variant.product_id.toString(),
            variantsId: variant.id.toString(),
            barcode: variant.barcode || null,
            compareAtPrice: variant.compare_at_price || null,
            createdAt: new Date(variant.created_at),
            fulfillmentService: variant.fulfillment_service,
            grams: variant.grams.toString(),
            imageId: variant.image_id || null,
            inventoryItemId: variant.inventory_item_id.toString(),
            inventoryManagement: variant.inventory_management || null,
            inventoryPolicy: variant.inventory_policy,
            inventoryQuantity: variant.inventory_quantity.toString(),
            oldInventoryQuantity: variant.old_inventory_quantity.toString(),
            position: variant.position.toString(),
            price: variant.price.toString(),
            requiresShipping: variant.requires_shipping,
            sku: variant.sku || null,
            taxable: variant.taxable,
            title: variant.title,
            updatedAt: new Date(variant.updated_at),
            weight: variant.weight.toString(),
            weight_unit: variant.weight_unit,
            option1: variant.option1,
            option2: variant.option2 || null,
            option3: variant.option3 || null,
            adminGraphqlApiId: variant.admin_graphql_api_id,
          },
        }).catch(error => console.error("Error upserting variant:", error))
      );
    });

    collectData.data.forEach(collect => {
      upsertPromises.push(
        prisma.collect.upsert({
          where: { collectId: collect.id.toString() },
          update: {
            collectionId: collect.collection_id.toString(),
            productId: collect.product_id.toString(),
            createdAt: new Date(collect.created_at),
            position: collect.position.toString(),
            sortValue: collect.sort_value,
            updatedAt: new Date(collect.updated_at),
          },
          create: {
            collectId: collect.id.toString(),
            collectionId: collect.collection_id.toString(),
            productId: collect.product_id.toString(),
            createdAt: new Date(collect.created_at),
            position: collect.position.toString(),
            sortValue: collect.sort_value,
            updatedAt: new Date(collect.updated_at),
          },
        }).catch(error => console.error("Error upserting collect:", error))
      );
    });

    collections.data.forEach(collection => {
      upsertPromises.push(
        prisma.collections.upsert({
          where: { collectionId: collection.id.toString() },
          update: {
            title: collection.title,
            bodyHtml: collection.body_html, 
            handle: collection.handle,
            image: collection.image || null,
            published: collection.published || null,
            publishedAt: collection.published_at ? new Date(collection.published_at) : null,
            publishedScope: collection.published_scope || null,
            sortOrder: collection.sort_order || null,
            templateSuffix: collection.template_suffix || null,
            updatedAt: collection.updated_at ? new Date(collection.updated_at) : new Date(),
            adminGraphqlApiId: collection.admin_graphql_api_id || null
          },
          create: {
            collectionId: collection.id.toString(),
            title: collection.title,
            bodyHtml: collection.body_html, 
            handle: collection.handle,
            image: collection.image || null,
            published: collection.published || null,
            publishedAt: collection.published_at ? new Date(collection.published_at) : new Date(),
            publishedScope: collection.published_scope || null,
            sortOrder: collection.sort_order || null,
            templateSuffix: collection.template_suffix || null,
            updatedAt: collection.updated_at ? new Date(collection.updated_at) : new Date(),
            adminGraphqlApiId: collection.admin_graphql_api_id || null
          }
        }).catch(error => console.error("Error upserting collection:", error))
      );
    });
    
    await Promise.all(upsertPromises);

    return json({
      message: "Products, images, options, and variants synced successfully",
    });
  } catch (error) {
    console.error("Error syncing products, images, options, and variants:", error);
    return json(
      {
        message: "Error syncing products, images, options, and variants",
        error: error.message,
      },
      { status: 500 },
    );
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
          <Button type="button" onClick={handleXML}>
            <img src={eyeIcon} alt="Eye Icon" width={15} />
          </Button>
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
            { title: "Image" },
            { title: "Id" },
            { title: "Title" },
            { title: "Action" },
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
