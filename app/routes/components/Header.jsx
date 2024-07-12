import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, ButtonGroup, Button, Link, Image } from "@shopify/polaris";
import logo from '../../assets/image/logo.png';

export const Header = () => (
  <Card sectioned>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >   
    <Link url="/app">
      <Image
        source={logo}
        alt="Local logo"
        style={{ maxWidth: "100px", height: "auto" }}
      />
       </Link>
      <ButtonGroup>
        <Link url="/app/changePlan">
          <Button size="large" primary>
            Change Plan
          </Button>
        </Link>
        <Link url="/app/productFeed">
          <Button size="large" primary>
            Add A Product Feed
          </Button>
        </Link>
        <Link url="/app/editSettings">
          <Button size="large" primary>
            Edit Settings
          </Button>
        </Link>
        <Link url="/app/editGoogle">
          <Button size="large" primary>
            Edit Google
          </Button>
        </Link>
        <Link url="/app/product">
          <Button size="large" primary>
            Product
          </Button>
        </Link>
      </ButtonGroup>
    </div>
  </Card>
);
