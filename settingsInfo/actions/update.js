import { applyParams, save, ActionOptions, UpdateSettingsInfoActionContext } from "gadget-server";

/**
 * @param { UpdateSettingsInfoActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateSettingsInfoActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
