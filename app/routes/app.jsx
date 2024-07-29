import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const showNavMenu = false;
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp={false} apiKey={apiKey}>
      {showNavMenu && (
        <NavMenu>
          <Link to="/app" rel="home">Dashboard</Link>
          <Link to="/app/changePlan">Change Plan</Link>
          <Link to="/app/productFeed">Add A Product Feed</Link>
          <Link to="/app/editSettings">Edit Settings</Link>
          <Link to="/app/editGoogle">Edit Google</Link>
        </NavMenu>
      )}
      {!showNavMenu}
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
