import { applyParams, preventCrossShopDataAccess, save, ActionOptions, UpdateShopifyAppSubscriptionActionContext } from "gadget-server";

/**
 * @param { UpdateShopifyAppSubscriptionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { UpdateShopifyAppSubscriptionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
