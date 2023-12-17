import { applyParams, preventCrossShopDataAccess, save, ActionOptions, RefreshInstallStateShopifyThemeActionContext } from "gadget-server";

/**
 * @param { RefreshInstallStateShopifyThemeActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { RefreshInstallStateShopifyThemeActionContext } context
 */

export async function onSuccess({ params, record, logger, api, connections }) {
  /**
   * Check if an specific app block was added to a template file.
   *
   * Works by testing all the blocks listed in the asset to see if they have the name of the app embed we're looking for
   */

  const shopify = await connections.shopify.forShopId(record.shopId);
  const themeId = record.id;

  const widgetInfoResponse = await api.settingsInfo.findMany({
    select: { id: true, active: true }
  });

  logger.info(widgetInfoResponse, "widgetInfo Response Response");
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
    logger.info({ fullAssetBlob }, " new product in shopify");

    const appId = '14256455744962681418';
    const parsedData = JSON.parse(type).current.blocks[appId];
    logger.info(parsedData.disabled.toString(), "created new product in shopify");

    if (parsedData.disabled == true) {
      await api.settingsInfo.update(parseInt(widgetInfoResponse[0].id), {
        settingsInfo: {
          active: false
        },
      });
    }
    else {
      await api.settingsInfo.update(parseInt(widgetInfoResponse[0].id), {
        settingsInfo: {
          active: true
        },
      });


    }
    // Detect if a particular app embed block has been configured on the theme in the theme editor
    // Strategy: find the  "config/settings_data.json" asset that records theme-wide blocks, parse the JSON, and check if a block with the name we care about is found in the blocks data
    // const parsedContent = await parsedAssetContents(themeId, "config/settings_data.json", shopify, logger);
    // if (parsedContent) {
    //   hasAppEmbedBlockInstalled = configContainsAppEmbedBlock(parsedContent, "embed-beta");
    // }
  };
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};