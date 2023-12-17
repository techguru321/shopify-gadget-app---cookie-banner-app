import { globalShopifySync, ActionOptions, GlobalShopifySyncGlobalActionContext } from "gadget-server";

/**
 * @param { GlobalShopifySyncGlobalActionContext } context
 */
export async function run({ params, logger, api }) {
  await globalShopifySync(params);
};

/** @type { ActionOptions } */
export const options = {
  transactional: false
};
