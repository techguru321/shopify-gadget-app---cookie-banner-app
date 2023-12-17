import { Client } from "@gadget-client/gdpr-banner-app-backup";

export const api = new Client({ environment: window.gadgetConfig.environment });
