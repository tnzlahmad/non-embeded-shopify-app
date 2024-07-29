import { Page, Grid, LegacyCard, Button, Image, Text } from "@shopify/polaris";
import logo from "../../assets/image/logo.png";
import React from "react";
import "../_index/styles.module.css";

export const ProductCatalog = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard sectioned>
            <Text as="h3">What to do next</Text>
            <p className="mt-2 mb-2">
              If you don’t have a product catalog, you have to create one:
            </p>
            <Button size="large" variant="primary" tone="success">
              Create product catalog in business manager
            </Button>
            <p className="mt-3">
              Follow the instructions. When asked for a product URL , copy and
              paste the Feed URL that provided above.{" "}
            </p>
            <p className="mt-3">Need Help? just email us at</p>
            <p className="mt-3">help@universal-apps.com</p>
          </LegacyCard>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard sectioned>
          <Text as="h3">Happy with the app?</Text>
            <Image
              source={logo}
              alt="Local logo"
              style={{ maxWidth: "100%" }}
              className="mt-3"
            />
            <p>
              We’ll appreciate if you could leave a short review that help us
              building new and better features instead of marketing.
            </p>
            <Button size="large" variant="primary" tone="success">
              Leave A Review
            </Button>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </div>
  );
};
