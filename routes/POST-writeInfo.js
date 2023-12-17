/**
 * Route handler for POST writeInfo
 *
 * @param { import("gadget-server").RouteContext } request context - Everything for handling this route, like the api client, Fastify request, Fastify reply, etc. More on effect context: https://docs.gadget.dev/guides/extending-with-code#effect-context
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Request}
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Reply}
 */
module.exports = async ({ request, reply, api, logger }) => {
  // This route file will respond to an http request -- feel free to edit or change it!
  // For more information on HTTP routes in Gadget applications, see https://docs.gadget.dev/guides/http-routes


  const widgetInfo = await api.settingsInfo.findFirst({
    select: { id: true, bgColor: true, btnTextColor: true, btnColor: true, size: true, text: true, btnText: true, position: true, theme: true, align: true, type: true, textColor: true, active: true, geo: true, acceptCounts: true, rejectCounts: true, countPP: true, shop: { id: true } }
  });
  const settingsInfo = {
    acceptCounts: parseInt(request.body.accept),
    rejectCounts: parseInt(request.body.reject),
    countPP: parseInt(request.body.countPP)
  };

  logger.info(
    { widgetInfo },
    "shop id and confirmation url"
  );
  var recordId = widgetInfo.id;
  await api.settingsInfo.update(recordId, { settingsInfo });

  reply.send({ widgetInfo: widgetInfo });
}
