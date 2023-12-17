import { applyParams, preventCrossShopDataAccess, save, ActionOptions, SubscribeShopifyShopActionContext } from "gadget-server";

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, currentAppUrl }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const plan = await api.plan.findFirst({
    filter: {
      name: {
        equals: "Lite",
      },
    },
  });
  const shop = record;

  // get return url for billing redirect
  const baseURL = process.env.NODE_ENV === "development" ? api.developmentApiRoot : api.productionApiRoot;
  const returnURL = `${baseURL}finished-subscription?shop_id=${shop.id}&plan_id=${plan.id}`;

  var isTestCharge = false;
  if (shop.planName == 'partner_test') {
    var isTestCharge = true;
  }

  // Determine when this should be test mode.
  const CREATE_SUBSCRIPTION_QUERY = `
    mutation CreateSubscription($name: String!, $price: Decimal!, $trialDays: Int!, $interval: AppPricingInterval!) {
      appSubscriptionCreate(
        name: $name,
        test: ${isTestCharge},
        trialDays: $trialDays,
        returnUrl: "${returnURL}",
        lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { amount: $price, currencyCode: USD }
              interval: $interval
            }
          }
        }]
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
      }
    }
  `;

  const result = await connections.shopify.current.graphql(CREATE_SUBSCRIPTION_QUERY, {
    name: plan.name,
    price: `${plan.monthlyPrice}`,
    interval: "EVERY_30_DAYS",
    trialDays: plan.trialDays,
  });

  const { confirmationUrl } = result.appSubscriptionCreate;

  // update fields in Gadget database
  await api.internal.shopifyShop.update(record.id, {
    shopifyShop: {
      confirmationUrl,
    },
  });
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};