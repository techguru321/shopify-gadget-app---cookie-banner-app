import React, { useEffect } from "react";
import { useFindFirst, useAction } from "@gadgetinc/react";
import { Page, Spinner } from "@shopify/polaris";
import { api } from "../api";
import { useNavigate } from "@shopify/app-bridge-react";

let currentShopExecute = null;
const SubscriptionWrapper = (props) => {
  const [{ fetching, data: currentShop }] = useFindFirst(
    api.shopifyShop,
    props.shopId
  );

  const navigate = useNavigate();

  const [createSubscriptionResponse, createSubscription] = useAction(
    api.shopifyShop.subscribe
  );

  useEffect(() => {
    if (currentShop?.activeSubscriptionId === null && !currentShopExecute) {
      currentShopExecute = true;
      createSubscription({ id: currentShop.id, shopifyShop: {} });
    }
  }, [currentShop]);

  if (
    fetching ||
    (!createSubscriptionResponse?.data &&
      currentShop?.activeSubscriptionId == null)
  ) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }

  if (currentShop.activeSubscriptionId != null) return props.children;

  if (createSubscriptionResponse?.data) {
    navigate(createSubscriptionResponse.data.confirmationUrl);
  }
};
export default SubscriptionWrapper;
