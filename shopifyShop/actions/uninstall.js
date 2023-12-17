import { transitionState, ShopifyShopState, applyParams, preventCrossShopDataAccess, save, ActionOptions, UninstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifyShopState.Installed, to: ShopifyShopState.Uninstalled });
  applyParams(params, record);

  // Setting plan and active subscription Id to null.
  record.plan = null;
  record.activeSubscriptionId = null
  record.confirmationUrl = null;

  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
