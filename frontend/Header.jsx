import React from 'react';
import { Layout, Button, Link } from '@shopify/polaris';
import IntercomChat from './IntercomChat';

const Header = () => {
  const handleLiveChatClick = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  return (
    <div className="header">
      <Layout>
        <Layout.Section>
          <Button external url="https://intercom.help/gorillamonk" target="_blank">
            FAQ
          </Button>

          <Button external url="https://www.gorillamonk.co/contact" target="_blank">
            HELP
          </Button>

          <Button onClick={handleLiveChatClick}>
            LIVE CHAT
          </Button>
        </Layout.Section>

        <div className="notFullWidthHr">
        </div>
      </Layout>
      <IntercomChat />
    </div>
  );
};

export default Header;
