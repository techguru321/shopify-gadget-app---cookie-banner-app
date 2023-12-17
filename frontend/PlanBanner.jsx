import React, { useState, useEffect, useCallback } from "react";
import { Layout, Button, Banner } from '@shopify/polaris';
import { useNavigate } from "react-router-dom";
import { useFindFirst, useAction, useFindMany } from "@gadgetinc/react";
import { api } from "./api";
const PlanBanner = () => {
  const [billingBannerEnabled, setBillingBannerEnabled] = useState(true);
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const shopDomain = data?.myshopifyDomain;

  const [refreshEmbedStateResponse, refreshEmbedState] = useAction(api.shopifyTheme.refreshInstallState);

  const handleUpgradeClick = () => {
    const settingsUrl = `https://admin.shopify.com/store/${shopDomain.replace('.myshopify.com', '')}/themes/current/editor?context=apps&appEmbed=f53a75fd-6936-4b73-baf3-bff177a14401%2Fapp-embed", "_blank`;

    window.open(settingsUrl);
  };

  const handleRefreshClick = () => {
    const status = refreshEmbedState({ id: 153826754865 });

  };

  return (
    <div className="planBanner">
      {widgetInfoResponse[0].active && (
        <Layout>
          <Layout.Section>
            <Banner
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>
                    Congratulation! You can view your banner on your store.
                  </span>
                </div>
              }
              status="success"
              onDismiss={() => setBillingBannerEnabled(false)}
            />
          </Layout.Section>
        </Layout>
      )}
      {!widgetInfoResponse[0].active && (
        <Layout>
          <Layout.Section>
            <Banner
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>
                    Almost done! Go to the app in your theme to show the cooke bar on your store.
                  </span>
                  <span style={{ marginRight: '10px' }}>
                    After enabling the app embed, click refresh
                    <Button onClick={handleRefreshClick}>
                      Refresh
                    </Button>
                  </span>
                  <Button onClick={handleUpgradeClick}>
                    Enable the app
                  </Button>
                </div>
              }
              status="warning"
              onDismiss={() => setBillingBannerEnabled(false)}
            />
          </Layout.Section>
        </Layout>
      )}
    </div>
  );
};

export default PlanBanner;
