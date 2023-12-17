import React, { useState } from "react";
import { useFindFirst, useQuery, useFindMany } from "@gadgetinc/react";
import {
  Page,
  Spinner,
  Text,
  Banner,
  Button,
  Layout,
  Grid, LegacyCard, ProgressBar
} from "@shopify/polaris";
import { Icon } from "@shopify/polaris";
import { ChevronUpMinor } from '@shopify/polaris-icons';
import { ChevronDownMinor } from '@shopify/polaris-icons';
import { CircleTickMajor } from '@shopify/polaris-icons';
import { CircleInformationMajor } from '@shopify/polaris-icons';
import { api } from "./api";
import { useNavigate } from "@shopify/app-bridge-react";

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      name
    }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const [{ data: metaData, fetching: fetchingGadgetMeta, error: metaError }] = useQuery({
    query: gadgetMetaQuery,
  });
  const [widgetInfoResponse] = useFindMany(api.settingsInfo, {
    select: { id: true, bgColor: true, textColor: true, linkColor: true, btnColor: true, btnBorderColor: true, btnTextColor: true, size: true, text: true, shop: { id: true }, position: true, theme: true, reviewEnabled: true, acceptCounts: true, rejectCounts: true, countPP: true }
  });

  const shopDomain = data?.myshopifyDomain;
  const shop = data;

  const handleGotoSettings = () => {
    navigate('/setting');
  }

  const handleActivateApp = () => {
    const url = `https://admin.shopify.com/store/${shopDomain.replace('.myshopify.com', '')}/themes/current/editor?context=apps&appEmbed=f53a75fd-6936-4b73-baf3-bff177a14401%2Fapp-embed`;

    window.open(url, "_blank");
  }

  const guideItems = [
    {
      statusIcon: <Icon source={CircleInformationMajor} color="base" />,
      header: "1. Enable App",
      content: "Activate our app to see it visible on your store.",
      buttonAction: handleActivateApp,
      buttonText: "Activate app",
    },
    {
      statusIcon: <Icon source={CircleTickMajor} color="base" />,
      header: "2. Setup your cookie banner",
      content: "Customize cookie bar banner appearance to ensure that your banner is visually appealing and consistent with your website's overall theme.",
      buttonAction: handleGotoSettings,
      buttonText: "Go to Settings",
    },

  ];

  const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);

  // Toggle guide collapse status
  const toggleGuideCollapse = () => {
    setIsGuideCollapsed(!isGuideCollapsed);
  };

  const initialCollapsedItems = guideItems.reduce((acc, _, index) => {
    acc[index] = false;
    return acc;
  }, {});

  const [collapsedItems, setCollapsedItems] = useState(initialCollapsedItems);

  const toggleGuideItemCollapse = (index) => {
    setCollapsedItems((prevState) => {
      const newState = { ...prevState }; // Create a copy of the current state
      newState[index] = !newState[index];
      return newState;
    });
  };

  if (error || metaError) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error?.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching || fetchingGadgetMeta) {
    return (
      <Page title="Dashboard">
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </Page>
    );
  }
  const TRIAL_LENGTH = 3;
  const daysUntilTrialOver = shop.trialStartedAt
    ? TRIAL_LENGTH -
      Math.floor(
        (new Date().getTime() - shop.trialStartedAt.getTime()) /
          (1000 * 3600 * 24)
      )
    : -1;

  return (
    <Page title="Dashboard">
      <Text as="h4" variant="headingXl">Welcome!</Text>
      <div style={{ margin: '20px 5px' }}>
        <LegacyCard sectioned>
          <div className="d-flex guide-header">
            <Text as="h4" variant="headingMd">
              <strong>Setup Guide</strong>
            </Text>
            <button onClick={toggleGuideCollapse}>
              {isGuideCollapsed ? <Icon source={ChevronDownMinor} color="base" /> : <Icon source={ChevronUpMinor} color="base" />}
            </button>
          </div>
          <p>Use this guide to quickly setup your cookie banner</p>
          <div className={`guide ${isGuideCollapsed ? "collapsed" : ""}`} style={{ paddingTop: '10px' }}>
            {guideItems.map((item, index) => (
              <div key={index} className="guide-item d-flex">
                <div>
                  {item.statusIcon}
                </div>
                <div>
                  <p className="guide-subheader" onClick={() => toggleGuideItemCollapse(index)}>
                    <strong>{item.header}</strong>
                  </p>
                  <div className={`guide-subcontent ${collapsedItems[index] ? "collapsed" : ""}`}>
                    <p>{item.content}</p>
                    <Button onClick={item.buttonAction}>{item.buttonText}</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LegacyCard>
      </div>
      <div style={{ margin: '20px 5px' }}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <LegacyCard title="Total Accepts" sectioned>
              <p>Count of total accepts: {(widgetInfoResponse && widgetInfoResponse.data && widgetInfoResponse.data.length > 0) ? widgetInfoResponse.data[0].acceptCounts : 0}</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <LegacyCard title="Total Rejects" sectioned>
              <p>Count of total rejects: {(widgetInfoResponse && widgetInfoResponse.data && widgetInfoResponse.data.length > 0) ? widgetInfoResponse.data[0].rejectCounts : 0} </p>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </div>
      <div style={{ margin: '20px 5px' }}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <LegacyCard title="Impression" sectioned>
              <p>Impression of the merchants: 0</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <LegacyCard title="Clicks of privacy policy" sectioned>
              <p>clicks of Privacy policy: {(widgetInfoResponse && widgetInfoResponse.data && widgetInfoResponse.data.length > 0) ? widgetInfoResponse.data[0].countPP : 0}</p>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </div>
      {/* TODO > This needs to be removed from here, it does not have any condition to when it shows and there is already a message on top using subscription wrapper*/}
      <div className="upgradePlans" style={{ margin: '20px 5px' }}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
            {/* <LegacyCard sectioned>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '20px', fontSize: '14px' }}>
                  {daysUntilTrialOver} days left until trial is over.
                </span>
              </div>
            </LegacyCard> */}
          </Grid.Cell>
        </Grid>
      </div>
    </Page>
  );
};

export default Dashboard;
