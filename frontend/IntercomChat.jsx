import React, { useEffect } from 'react';

const IntercomChat = () => {
  useEffect(() => {
    window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'zyosdleu',
      name: 'Steven',
      email: 'info@gorillamonk.co',
    };

    if (window.Intercom) {
      window.Intercom('reattach_activator');
      window.Intercom('update', window.intercomSettings);
      window.Intercom('hide');
    } else {
      var d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      window.Intercom = i;
      var l = function () {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/zyosdleu';
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === 'complete') {
        l();
      } else if (window.attachEvent) {
        window.attachEvent('onload', l);
      } else {
        window.addEventListener('load', l, false);
      }
    }

    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, []);

  return null; // The component doesn't render anything, it's just for initializing Intercom
};

export default IntercomChat;
