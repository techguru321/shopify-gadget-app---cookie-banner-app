import { transitionState, ShopifyShopState, applyParams, save, ActionOptions, InstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
};

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // add sample plans to the db on install
  // const plan = await api.plan.findFirst({
  //   filter: {
  //     name: {
  //       equals: "Lite",
  //     },
  //   },
  // });

  // if (plan.length == 0) {
  //   await api.plan.create({
  //     plan: {
  //       name: "Lite",
  //       description: "3-day trial",
  //       trialDays: 3,
  //       monthlyPrice: 3,
  //       features: [
  //         "Unlimited Banner Views",
  //         "Fully Customizable Banner",
  //         "GDPR Compliant",
  //         "Geo-location-based cookie consent (show banner only to EU visitors)",
  //         "Activity Reporting",
  //         "Chat & Email support"
  //       ]
  //     }
  //   });
  // }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
