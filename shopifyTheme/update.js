import { applyParams, preventCrossShopDataAccess, save, ActionOptions, UpdateShopifyThemeActionContext } from "gadget-server";

/**
 * @param { UpdateShopifyThemeActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { UpdateShopifyThemeActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shopify = await connections.shopify.forShopId(record.shopId);
  const themeId = params.id;

  let hasAppEmbedBlockInstalled = false;


  const themeAssets = await shopify.asset.list(themeId);

  // Detect if a particular app block has been configured on a page in the theme editor
  // Strategy: find the page we care about, parse the JSON file that configures it, and check if a block with the name we care about is found in the blocks data


  // Detect liquid code added manually by the merchant to the theme in the Customize Code theme editor
  // Strategy: fetch the layout/theme.liquid asset and see if it matches a given regexp
  const layoutLiquid = themeAssets.find(asset => asset.key == "config/settings_data.json");

  if (layoutLiquid) {
    // fetch the contents of the asset for matching
    const fullAssetBlob = await shopify.asset.get(themeId, { "asset[key]": "config/settings_data.json" });
    const type = fullAssetBlob.value;
    logger.info({ type }, " new product in shopify");

    const appId = '14256455744962681418';
    const parsedData = JSON.parse(type).current.blocks[appId];
    const disable = parsedData.type;
    logger.info(JSON.stringify(type), "created new product in shopify");
    logger.info(
      { disable, themeId: record.id },
      "shop id and confirmation url"
    );

    const product = await shopify.asset.update(themeId, {
      "asset[key]": "config/settings_data.json",
      "asset[value]": JSON.stringify(type),
    });
    logger.info({ product }, "created new product in shopify");


  }
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
