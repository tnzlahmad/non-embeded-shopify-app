import React from "react";
import { BlockStack, Button, Card, InlineGrid, Text } from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";

export const CustomCard = () => {
  return (
    <div style={{ marginTop: '25px' }}>
    <Card roundedAbove="lg" >
      <BlockStack gap="200">
      <Text as="h2" variant="headingLg" >
      Login Details
          </Text>
        <InlineGrid columns="1fr auto">
          <Text as="p" variant="bodyMd">
          Currently logged in as: beautygirl-pk
         </Text>
           <Text as="p" variant="bodyMd">
           Return back to Shopify Admin
          </Text>
        </InlineGrid>
      </BlockStack>
    </Card>
    </div>
  );
}
