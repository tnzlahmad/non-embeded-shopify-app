import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, ButtonGroup, Button, Link, Image } from "@shopify/polaris";
import { useLocation } from "react-router-dom";
import logo from '../../assets/image/logo.png';

export const Header = ({ handleSync }) => {
  const location = useLocation();
  
  const isAppPage = location.pathname === '/app';

  return (
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
          <Link url="/app/productFeed">
            <Button size="large" primary>
              Add A Product Feed
            </Button>
          </Link>
          {isAppPage ? (
            <Button onClick={handleSync}>Sync</Button>
          ) : (
            <Link url="/app">
              <Button size="large" primary>View Feed</Button>
            </Link>
          )}
        </ButtonGroup>
      </div>
    </Card>
  );
};
