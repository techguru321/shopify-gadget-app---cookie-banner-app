const appUrl = "https://shopify-gdpr-banner-app.gadget.app";

window.addEventListener('load', async function () {

    const response = await fetch(appUrl + '/getInfo', {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ shopDomain: Shopify.shop }),
    });
    const res = await response.json()
    var widgetInfo = res.widgetInfo;
    var activeStatus = widgetInfo.active;
    if (activeStatus == false || localStorage.getItem('cookieAccepted'))
        return;
    var geoInfo = widgetInfo.geo;
    const eeaCountryCodes = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH', 'UK'];
    var region = 'All';
    var ip = "";
    fetch(appUrl + '/user-info')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ip = data.ip;
            region = data.country;
            if (eeaCountryCodes.includes(region)) {
                region = 'EU';
            }
            if (geoInfo == region || geoInfo == "All") {
                var textColor_w = '', bannerPosition = '', backgroundColor_w = '', size_w = '', fontSize_w = "", text_w = '', align = '';
                var btnBorderColor_w = '', btnColor_w = '', btnTextColor_w = '', linkColor_w = '';
                var theme = '';
                var isCard = true;
                backgroundColor_w = JSON.parse(widgetInfo.bgColor);
                textColor_w = JSON.parse(widgetInfo.textColor);
                linkColor_w = JSON.parse(widgetInfo.linkColor);
                btnBorderColor_w = JSON.parse(widgetInfo.btnBorderColor);
                btnTextColor_w = JSON.parse(widgetInfo.btnTextColor);
                btnColor_w = JSON.parse(widgetInfo.btnColor);
                fontSize_w = widgetInfo.size;
                size_w = widgetInfo.size;
                text_w = widgetInfo.text;
                bannerPosition = widgetInfo.position;
                theme = widgetInfo.theme;
                align = widgetInfo.align;

                if (bannerPosition == 'banner-top' || bannerPosition == 'banner-bottom') {
                    isCard = false;
                }

                var fixedElement = document.createElement('div');
                if (theme == 'custom')
                    fixedElement.innerHTML = `<div id='headerbar' class = 'consent ${bannerPosition} ${theme} ${size_w}' style='text-align:center; justify-content: center; color: rgba(${textColor_w.r}, ${textColor_w.g}, ${textColor_w.b}, ${textColor_w.a}); background-color: rgba(${backgroundColor_w.r}, ${backgroundColor_w.g}, ${backgroundColor_w.b}, ${backgroundColor_w.a});  font-size: ${fontSize_w}px;'>
                    <div style='text-align: right; height: 20px;'><button class="reject"></button></div>
                    <div style="display: ${isCard ? 'block' : 'flex'}; align-items: center; justify-content: ${isCard ? 'initial' : (align == 1 ? 'space-between' : 'space-around')};">
                    <div style="color: rgba(${textColor_w.r}, ${textColor_w.g}, ${textColor_w.b}, ${textColor_w.a}); background-color: rgba(${backgroundColor_w.r}, ${backgroundColor_w.g}, ${backgroundColor_w.b}, ${backgroundColor_w.a}); margin-bottom: ${isCard ? '8px' : '0px'}; text-align: ${isCard ? 'center' : 'initial'}; margin-right: ${isCard ? '0px' : '15px'};">${text_w}</div>
                    <div style='text-align: ${isCard ? 'center' : 'initial'}; padding-top: ${isCard ? '0.5rem' : '0px'};'><a class='accept' style="font-size: ${fontSize_w}px; color: rgba(${btnTextColor_w.r}, ${btnTextColor_w.g}, ${btnTextColor_w.b}, ${btnTextColor_w.a}); border-color: rgba(${btnBorderColor_w.r}, ${btnBorderColor_w.g}, ${btnBorderColor_w.b}, ${btnBorderColor_w.a}); background-color: rgba(${btnColor_w.r}, ${btnColor_w.g}, ${btnColor_w.b}, ${btnColor_w.a});">Accept</a></div></div>
                </div>`;
                else
                    fixedElement.innerHTML = `<div id='headerbar' class = 'consent ${bannerPosition} ${theme} ${size_w}' style='text-align:center; justify-content: center; font-size: ${fontSize_w}px;'>
                    <div style='text-align: right; height: 20px;'><button class="reject"></button></div>
                    <div style="display: ${isCard ? 'block' : 'flex'}; align-items: center; justify-content: ${isCard ? 'initial' : (align == 1 ? 'space-between' : 'space-around')};">
                    <div style="margin-bottom: ${isCard ? '8px' : '0px'}; text-align: ${isCard ? 'center' : 'initial'}; margin-right: ${isCard ? '0px' : '15px'};">${text_w}</div>
                    <div style='text-align: ${isCard ? 'center' : ''}; padding-top: ${isCard ? '0.5rem' : ''};'><a class='accept' style="font-size: ${fontSize_w}px;">Accept</a></div></div>
                </div>`;

                const container = document.querySelector('.gradient');
                const sectionHeader = document.querySelector('.section-header');

                container.insertBefore(fixedElement, sectionHeader);

                if (theme == "custom") {
                    var aTags = fixedElement.querySelectorAll("a");
                    var linkColor_w_str = `rgba(${linkColor_w.r}, ${linkColor_w.g}, ${linkColor_w.b}, ${linkColor_w.a})`;

                    for (var i = 0; i < aTags.length; i++) {
                        aTags[i].style.color = linkColor_w_str;
                    }
                }

                var rejectButton = fixedElement.querySelector('.reject');

                rejectButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"></path></svg>';

                rejectButton.addEventListener('click', async function () {
                    var headerElement = document.getElementById('headerbar');
                    headerElement.style.display = 'none';
                    const incrementedAccept = (widgetInfo.acceptCounts || 0);
                    const incrementedReject = (widgetInfo.rejectCounts || 0) + 1;
                    const incrementedCountPP = (widgetInfo.countPP || 0);

                    const response = await fetch(appUrl + '/writeInfo', {
                        method: 'POST',
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            "accept": incrementedAccept,
                            "reject": incrementedReject,
                            "countPP": incrementedCountPP
                        }),
                    });
                });

                var acceptLink = fixedElement.querySelector('.accept');

                acceptLink.addEventListener('click', async function () {
                    const incrementedAccept = (widgetInfo.acceptCounts || 0) + 1;
                    const incrementedReject = (widgetInfo.rejectCounts || 0);
                    const incrementedCountPP = (widgetInfo.countPP || 0);

                    const response = await fetch(appUrl + '/writeInfo', {
                        method: 'POST',
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            "accept": incrementedAccept,
                            "reject": incrementedReject,
                            "countPP": incrementedCountPP
                        }),
                    });
                    // Store the acceptance flag in local storage
                    localStorage.setItem('cookieAccepted', 'true');

                    const expirationDate = new Date();
                    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                    document.cookie = `cookieConsent=true; expires=${expirationDate.toUTCString()}; path=/`;
                    document.cookie = `ipAddress=${ip}; path=/`;
                    document.cookie = `country=${region}; path=/`;
                    fixedElement.style.display = 'none';
                });
            }
        });
});