import React from "react";
import { BlockStack, Button, Card, InlineGrid, Text } from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";

export const CustomCard = ({
  title,
  leftAccessibility,
  rightAccessibility,
}) => {
  return (
    <div style={{ marginTop: "25px" }}>
      <Card roundedAbove="lg">
        <BlockStack gap="200">
          <Text as="h2" variant="headingLg">
            {title}
          </Text>
          <InlineGrid columns="1fr auto">
            <Text as="p" variant="bodyMd">
              {leftAccessibility}
            </Text>
            <Text as="p" variant="bodyMd">
              {rightAccessibility}
            </Text>
          </InlineGrid>
        </BlockStack>
      </Card>
    </div>
  );
};
