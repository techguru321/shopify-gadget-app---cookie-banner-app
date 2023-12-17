import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { Page, Spinner, Text, Frame } from "@shopify/polaris";
import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Setting from "./SettingsPage";
import Dashboard from "./Dashboard";
import Billing from "./Billing";
import Feedback from "./Feedback";
import Header from "./Header";
import PlanBanner from "./PlanBanner";
import { api } from "./api";
import SubscriptionWrapper from "./components/SubscriptionWrapper";
import { useFindFirst, useFindMany } from "@gadgetinc/react";

const Error404 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/shopify/install")
      return navigate("/", { replace: true });
  }, [location.pathname]);
  return <div>404 not found</div>;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const history = useMemo(
    () => ({ replace: (path) => navigate(path, { replace: true }) }),
    [navigate]
  );

  const appBridgeRouter = useMemo(
    () => ({
      location,
      history,
    }),
    [location, history]
  );

  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
      router={appBridgeRouter}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
};

function AuthenticatedApp() {
  // we use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated, loading } = useGadget();
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

function EmbeddedApp() {
  const location = useLocation();
  const isBillingPage = location.pathname === "/billing";
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const shopId = data?.id;

  return (
    <Frame>
      {!isBillingPage && (
        <div>
          <Header />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/setting" element={<Setting />} />
        {/* <Route path="/billing" element={<Billing />} /> */}
        <Route path="/feature-requests" element={<Feedback />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <NavigationMenu
        navigationLinks={[
          {
            label: "Dashboard",
            destination: "/",
          },
          {
            label: "Settings",
            destination: "/setting",
          },
          {
            label: "Feature Requests",
            destination: "/feature-requests",
          },
        ]}
      />
    </Frame>
  );
}

function UnauthenticatedApp() {
  return (
    <Page title="App">
      <Text variant="bodyMd" as="p">
        App can only be viewed in the Shopify Admin.
      </Text>
    </Page>
  );
}

export default App;
