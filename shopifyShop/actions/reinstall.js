import { transitionState, ShopifyShopState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ReinstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifyShopState.Uninstalled, to: ShopifyShopState.Installed });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // sync subscription record on reinstall
  // console.log({ record }, "record while reinstalling the app");
  // await api.shopifySync.run({
  //   shopifySync: {
  //     models: ["shopifyAppSubscription"
  //       // , "shopifyAppUsageRecord"
  //     ],
  //     shop: {
  //       _link: record.id,
  //     },
  //     domain: record.domain,
  //   },
  // });
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
