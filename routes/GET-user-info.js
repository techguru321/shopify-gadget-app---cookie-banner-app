import { RouteContext } from "gadget-server";

/**
 * Route handler for GET test
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {

  const ipInfo = await fetch('https://ipapi.co/' + request.ip + '/json/');

  return await ipInfo.json();
}
