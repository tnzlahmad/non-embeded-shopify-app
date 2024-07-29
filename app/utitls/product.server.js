// utils/prisma.server.js
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();
export async function saveProducts(products) {
  const successfulInserts = [];
  const failedInserts = [];
  for (const product of products) {
    try {
      // Check if the product already exists based on shopifyId
      const existingProduct = await prisma.product.findUnique({
        where: {
          shopifyId: String(product.id),
        },
      });
      if (!existingProduct) {
        // Product does not exist, proceed with insertion
        const result = await prisma.product.create({
          data: {
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
        successfulInserts.push(result);
      }
    } catch (error) {
      failedInserts.push({ product, error });
      console.error('Error inserting product:', error);
    }
  }
  console.log('Successful inserts:', successfulInserts.length);
  console.log('Failed inserts:', failedInserts.length);
  return { successfulInserts, failedInserts };
}