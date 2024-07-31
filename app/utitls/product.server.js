// utils/prisma.server.js
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();
export async function saveProducts(products) {
  const successfulUpserts = [];
  const failedUpserts = [];

  for (const product of products) {
    try {
      const result = await prisma.product.upsert({
        where: { shopifyId: String(product.id) },
        update: {
          title: product.title,
          bodyHtml: product.body_html,
          createdAt: new Date(product.created_at),
          handle: product.handle,
          productType: product.product_type,
          publishedAt: new Date(product.published_at),
          publishedScope: product.published_scope,
          status: product.status,
          tags: product.tags,
          templateSuffix: product.template_suffix,
          updatedAt: new Date(product.updated_at),
          vendor: product.vendor,
          adminGraphqlApiId: product.admin_graphql_api_id,
          imageUrl: product.image?.src || null,
        },
        create: {
          shopifyId: String(product.id),
          title: product.title,
          bodyHtml: product.body_html,
          createdAt: new Date(product.created_at),
          handle: product.handle,
          productType: product.product_type,
          publishedAt: new Date(product.published_at),
          publishedScope: product.published_scope,
          status: product.status,
          tags: product.tags,
          templateSuffix: product.template_suffix,
          updatedAt: new Date(product.updated_at),
          vendor: product.vendor,
          adminGraphqlApiId: product.admin_graphql_api_id,
          imageUrl: product.image?.src || null,
        },
      });
      successfulUpserts.push(result);
    } catch (error) {
      failedUpserts.push({ product, error });
      console.error('Error upserting product:', error);
    }
  }

  console.log('Successful upserts:', successfulUpserts.length);
  console.log('Failed upserts:', failedUpserts.length);

  return { successfulUpserts, failedUpserts };
}


export async function upsertImages(images) {
  const successfulUpserts = [];
  const failedUpserts = [];

  for (const image of images) {
    try {
      const result = await prisma.images.upsert({
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
      });
      successfulUpserts.push(result);
    } catch (error) {
      failedUpserts.push({ image, error });
      console.error('Error upserting image:', error);
    }
  }

  console.log('Successful upserts:', successfulUpserts.length);
  console.log('Failed upserts:', failedUpserts.length);

  return { successfulUpserts, failedUpserts };
}


export async function upsertOptions(options) {
  const successfulUpserts = [];
  const failedUpserts = [];

  for (const option of options) {
    try {
      const result = await prisma.options.upsert({
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
      });
      successfulUpserts.push(result);
    } catch (error) {
      failedUpserts.push({ option, error });
      console.error('Error upserting option:', error);
    }
  }

  console.log('Successful upserts for options:', successfulUpserts.length);
  console.log('Failed upserts for options:', failedUpserts.length);

  return { successfulUpserts, failedUpserts };
}


export async function upsertVariants(variants) {
  const successfulUpserts = [];
  const failedUpserts = [];

  for (const variant of variants) {
    try {
      const result = await prisma.variants.upsert({
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
      });
      successfulUpserts.push(result);
    } catch (error) {
      failedUpserts.push({ variant, error });
      console.error('Error upserting variant:', error);
    }
  }

  console.log('Successful upserts for variants:', successfulUpserts.length);
  console.log('Failed upserts for variants:', failedUpserts.length);

  return { successfulUpserts, failedUpserts };
}


export async function upsertCollects(collects) {
  const successfulUpserts = [];
  const failedUpserts = [];

  for (const collect of collects) {
    try {
      const result = await prisma.collect.upsert({
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
      });
      successfulUpserts.push(result);
    } catch (error) {
      failedUpserts.push({ collect, error });
      console.error('Error upserting collect:', error);
    }
  }

  console.log('Successful upserts for collects:', successfulUpserts.length);
  console.log('Failed upserts for collects:', failedUpserts.length);

  return { successfulUpserts, failedUpserts };
}


export async function upsertCollections(collections) {
  const successfulUpserts = [];
  const failedUpserts = [];

  for (const collection of collections) {
    try {
      const result = await prisma.collections.upsert({
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
          adminGraphqlApiId: collection.admin_graphql_api_id || null,
        },
        create: {
          collectionId: collection.id.toString(),
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
          adminGraphqlApiId: collection.admin_graphql_api_id || null,
        },
      });
      successfulUpserts.push(result);
    } catch (error) {
      failedUpserts.push({ collection, error });
      console.error('Error upserting collection:', error);
    }
  }

  console.log('Successful upserts for collections:', successfulUpserts.length);
  console.log('Failed upserts for collections:', failedUpserts.length);

  return { successfulUpserts, failedUpserts };
}