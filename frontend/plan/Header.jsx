import { useNavigate } from "@shopify/app-bridge-react";
import { Button, Text, HorizontalStack, VerticalStack } from '@shopify/polaris';
import { useAction } from "@gadgetinc/react";
import { useCallback } from 'react';
import { api } from "../api";

const Header = ({ plan, isCurrent, shopId }) => {
  const navigate = useNavigate();

  const [createSubscriptionResponse, createSubscription] = useAction(api.shopifyShop.subscribe);

  const subscribe = useCallback(async (planName) => {
    await createSubscription({ id: shopId, plan: planName });
  }, [plan]);
  const handleClick = () => {
    if (plan.name === "Free") {
      // await deleteSubscription({ id: shopId });
      subscribe(plan.name);

    } else {
      subscribe(plan.name);
    }
  };
  const buttonMarkup =
    isCurrent ? (
      <Button primary disabled>
        Current
      </Button>
    ) : (
      <Button
        primary
        loading={createSubscriptionResponse.fetching}
        disabled={!!createSubscriptionResponse.error}
        onClick={() => handleClick(plan.name)}
      >
        Select
      </Button>
    );

  if (createSubscriptionResponse?.data?.confirmationUrl) {
    const { confirmationUrl } = createSubscriptionResponse.data;
    navigate(confirmationUrl);
  }

  return (
    <HorizontalStack align="space-between">
      <VerticalStack>
        <Text as="h2" variant="headingLg">
          {plan.name}
        </Text>
        <Text as="p" variant="bodyLg">
          {plan.description}
        </Text>
      </VerticalStack>
      {buttonMarkup}
    </HorizontalStack>
  )
};

export default Header;
