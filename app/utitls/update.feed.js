import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateProductFeedURL(feedName, productFeedURL) {
  try {
    console.log(`Updating feedName: ${feedName} with productFeedURL: ${productFeedURL}`);
    const result = await prisma.productFeed.update({
      where: { feedName },
      data: { productFeedURL },
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error updating productFeedURL:', error);
    return { success: false, error: error.message };
  }
}
