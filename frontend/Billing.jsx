import { useFindFirst, useFindMany } from "@gadgetinc/react";
import {
  Page,
  Spinner,
  Text,
  HorizontalGrid,
} from "@shopify/polaris";
import { api } from "./api";
import { useNavigate } from '@shopify/app-bridge-react';
import Plan from './plan/Plan';

const Billing = () => {
  const navigate = useNavigate();
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const [{ data: plans, fetching: fetchingPlans, error: plansError }] = useFindMany(api.plan);
  const [{ data: subscriptionData, fetching: fetchingSubscription, error: subscriptionError }] = useFindFirst(api.shopifyAppSubscription, {
    filter: {
      status: {
        equals: "ACTIVE"
      }
    }
  });
  console.log(subscriptionData);
  const shopId = data?.id;

  if (error || plansError || subscriptionError) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error?.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching || fetchingPlans || fetchingSubscription) {
    return (
      <Page
        title="Billing"
        backAction={{
          content: 'Back',
          onAction: () => navigate('/'),
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </Page>
    )
  }

  return (
    <Page
      title="Billing"
      backAction={{
        content: 'Back',
        onAction: () => navigate('/'),
      }}
    >
      <HorizontalGrid gap="4" columns={plans?.length}>
        {plans?.map((plan, index) => {
          return (
            <Plan
              key={`plan-${index}`}
              shopId={shopId}
              plan={plan}
              current={subscriptionData}
            />
          )
        })}
      </HorizontalGrid>
    </Page>
  );
};

export default Billing;