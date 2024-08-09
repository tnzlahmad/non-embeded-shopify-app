import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const feedName = formData.get("feedName");

  if (actionType === "deleteFeed" && feedName) {
    try {
      const productFeed = await prisma.productFeed.findUnique({
        where: { feedName },
      });

      if (!productFeed) {
        return json({ success: false, message: "Product feed not found" });
      }

      await prisma.productFeed.delete({
        where: { feedName },
      });

      return json({ success: true, message: "Product feed deleted successfully" });
    } catch (error) {
      console.error("Error deleting product feed:", error);
      return json({ success: false, message: "An error occurred while deleting the product feed" });
    } finally {
      await prisma.$disconnect();
    }
  }

  return json({ success: false, message: "Invalid action type or missing feedName" }, { status: 400 });
};
