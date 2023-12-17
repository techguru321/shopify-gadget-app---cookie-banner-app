import React, { useEffect } from 'react';
import { Page, Layout, LegacyCard } from "@shopify/polaris";

const BoardToken = '8da24748-7cfb-7482-d5a1-a8f0e2845258';

const Feedback = () => {
  useEffect(() => {
    (function (w, d, i, s) { function l() { if (!d.getElementById(i)) { var f = d.getElementsByTagName(s)[0], e = d.createElement(s); e.type = "text/javascript", e.async = !0, e.src = "https://canny.io/sdk.js", f.parentNode.insertBefore(e, f) } } if ("function" != typeof w.Canny) { var c = function () { c.q.push(arguments) }; c.q = [], w.Canny = c, "complete" === d.readyState ? l() : w.attachEvent ? w.attachEvent("onload", l) : w.addEventListener("load", l, !1) } })(window, document, "canny-jssdk", "script");

    Canny('render', {
      boardToken: BoardToken,
      basePath: '/feature-requests',
    });
  }, []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <LegacyCard>
            <div className="cannyWidget">
              <div data-canny />
            </div>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Feedback;
