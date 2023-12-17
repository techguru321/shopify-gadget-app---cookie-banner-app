/**
 * Route handler for GET finished-subscription
 *
 * @param { import("gadget-server").RouteContext } request context - Everything for handling this route, like the api client, Fastify request, Fastify reply, etc. More on effect context: https://docs.gadget.dev/guides/extending-with-code#effect-context
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Request}
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Reply}
 */
module.exports = async ({ request, reply, api, logger, connections }) => {
  // get query params from request
  const { shop_id, plan_id, charge_id, } = request.query;

  const shop = await api.shopifyShop.findOne(shop_id, {
    select: {
      id: true,
      installedViaApiKey: true,
      domain: true

    }
  });
  
  // get an instance of the shopify-api-node API client for this shop
  const shopify = await connections.shopify.forShopId(shop.id);

  // make an API call to Shopify to validate that the charge object for this shop is active
  // const result = await connections.shopify.graphql(`
  const result = await shopify.graphql(`
    query {
      node(id: "gid://shopify/AppSubscription/${charge_id}") {
        id
        ... on AppSubscription {
          status
          name
        }
      }
    }
  `);

  if (result.node.status !== "ACTIVE") {
    // the merchant has not accepted the charge, so we can show them a message
    await reply.code(400).send("Invalid charge ID specified");
    return;
  }

  // the merchant has accepted the charge, so we can grant them access to our application
  // mark the shop as paid by setting the `plan` attribute to the charged plan namemodel

  await api.internal.shopifyShop.update(shop.id, {
    plan: {
      _link: plan_id,
    },
    activeSubscriptionId: parseInt(charge_id),
    trialStartedAt: new Date()
  })

  // send the user back to the embedded app
  await reply.redirect(`https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`);
}
