import React, { useState, useEffect, useCallback } from "react";
import { EditorState, ContentState, convertToRaw, convertFromRaw, convertFromHTML, convertToHTML } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { SketchPicker } from 'react-color';
import { Page, CalloutCard, Layout, Card, TextContainer, TextField, Select, Button, ButtonGroup, TextStyle, Link, Stack, ColorPicker, LegacyCard, LegacyTabs, LegacyStack, Checkbox, Icon, Modal, Form, FormLayout, Banner, RangeSlider } from "@shopify/polaris";
import { hsbToHex, rgbToHsb } from '@shopify/polaris';
import { MobileMajor, DesktopMajor } from '@shopify/polaris-icons';
import ReactHtmlParser from "react-html-parser";
import styles from "./App.css";
import styles1 from "./placeholder.css";
import { CaretDownMinor } from '@shopify/polaris-icons';
import { CaretUpMinor } from '@shopify/polaris-icons';
import { CancelSmallMinor, CancelMajor } from '@shopify/polaris-icons';
import { useFindFirst, useFindOne, useAction, useFindMany } from "@gadgetinc/react";
import { api } from "./api";
import { Popover } from '@shopify/polaris';
import IntercomChat from './IntercomChat';

import {
  Text,
  HorizontalStack,
  Box,
  Badge,
  VerticalStack,
  useBreakpoints,
} from '@shopify/polaris';
const SettingsPage = (shopId) => {
  const [reviewWidgetVisible, setReviewWidgetVisible] = useState(true);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleStarSelection = (stars) => {
    setSelectedStars(stars);
    setHoveredStars(0);
  };

  const renderStarIcon = (index) => {
    const filledStars = selectedStars;
    const hoveredStar = hoveredStars;
    const isFilled = index + 1 <= (hoveredStar || filledStars);

    return (
      <label
        key={index}
        className={`star ${index < hoveredStars ? 'hovered' : ''} ${index < selectedStars ? 'selected' : ''}`}
        onMouseEnter={() => setHoveredStars(index + 1)}
        onMouseLeave={() => setHoveredStars(0)}
        onClick={() => handleStarSelection(index + 1)}
      >
        <input type="radio" name="rating" value={index + 1} checked={isFilled} onChange={() => { }} />
      </label>
    );
  };

  const handleSubmitReview = () => {
    if (selectedStars < 5) {
      setShowReviewModal(true);
    } else {
      window.location.href = "https://apps.shopify.com";
    }
  };

  const [selectedFont, setSelectedFont] = useState('Arial');

  const handleFontChange = (selected) => {
    setSelectedFont(selected);
  };

  const textToolbarConfig = {
    options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
    },
    blockType: {
      inDropdown: false,
      options: ['unordered', 'ordered', 'indent', 'outdent'],
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered'],
    },
    textAlign: {
      inDropdown: false,
      options: ['left', 'center', 'right', 'justify'],
    },
    link: { showOpenOptionOnHover: true },
  };

  const [widgetBackgroundColor_w, setWidgetBackgroundColor_w] = useState({
    r: 28,
    g: 36,
    b: 62,
    a: 1,
  });
  const [widgetTextColor_w, setWidgetTextColor_w] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [widgetLinkColor_w, setWidgetLinkColor_w] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [widgetBtnColor_w, setWidgetBtnColor_w] = useState({
    r: 24,
    g: 99,
    b: 220,
    a: 1,
  });
  const [widgetBtnBorderColor_w, setWidgetBtnBorderColor_w] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [widgetBtnTextColor_w, setWidgetBtnTextColor_w] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [widgetSize_w, setWidgetSize_w] = useState(15);
  const [widgetPosition, setWidgetPosition] = useState("box-bottom-right");
  const [widgetTheme, setWidgetTheme] = useState("dark");
  const [widgetAlign, setWidgetAlign] = useState(0);
  const [widgetGeo, setWidgetGeo] = useState('EU');

  const initialContent = '<strong>🍪 We use cookies.</strong><p>Cookies help us deliver the best experience on our website. By using our website, you agree to the use of cookies.</p>';
  const initialContentState = ContentState.createFromBlockArray(convertFromHTML(initialContent));
  const [richText_w, setRichText_w] = useState(
    EditorState.createWithContent(initialContentState)
  );

  const [btnText_w, setBtnText_w] = useState('Accept');

  const [activeModal, setActiveModal] = useState(false);
  const [isSaveSettingsModalOpen, setIsSaveSettingsModalOpen] = useState(false);
  const [popoverActiveTextColor, setPopoverActiveTextColor] = useState(false);
  const [popoverActiveBgColor, setPopoverActiveBgColor] = useState(false);
  const [popoverActiveLinkColor, setPopoverActiveLinkColor] = useState(false);
  const [popoverActiveBtnColor, setPopoverActiveBtnColor] = useState(false);
  const [popoverActiveBtnBorderColor, setPopoverActiveBtnBorderColor] = useState(false);
  const [popoverActiveBtnTextColor, setPopoverActiveBtnTextColor] = useState(false);

  const [shopResponse] = useFindFirst(api.shopifyShop, {
    select: { id: true, domain: true },
  });
  const [createWidgetInfoResponse, createWidgetInfo] = useAction(api.settingsInfo.create);
  const [updateWidgetInfoResponse, updateWidgetInfo] = useAction(api.settingsInfo.update);
  // const [refreshEmbedStateResponse, refreshEmbedState] = useAction(api.shopifyTheme.refreshInstallState);
  const refreshEmbed = useCallback(async () => {
    handleToggle();
    // const status = await refreshEmbedState({ id: 153826754865 });
    // console.log(status);
  });

  const [widgetInfoResponse] = useFindMany(api.settingsInfo, {
    select: { id: true, bgColor: true, type: true, align: true, textColor: true, linkColor: true, btnColor: true, btnBorderColor: true, btnTextColor: true, size: true, text: true, btnText: true, shop: { id: true }, position: true, theme: true, reviewEnabled: true, acceptCounts: true, rejectCounts: true, countPP: true }
  });


  const [enabled, setEnabled] = useState(true);

  const handleToggle = useCallback(() => setEnabled((enabled) => !enabled), []);

  const contentStatus = enabled ? 'Turn off' : 'Turn on';

  const toggleId = 'setting-toggle-uuid';

  const { mdDown } = useBreakpoints();

  const badgeStatus = enabled ? 'success' : undefined;

  const badgeContent = enabled ? 'On' : 'Off';

  const title = 'Banner Status:';

  const settingStatusMarkup = (
    <Badge
      status={badgeStatus}
      statusAndProgressLabelOverride={`Setting is ${badgeContent}`}
    >
      {badgeContent}
    </Badge>
  );

  const settingTitle = title ? (
    <HorizontalStack gap="2" wrap={false}>
      <HorizontalStack gap="2" align="start" blockAlign="baseline">
        <label htmlFor={toggleId}>
          <Text variant="headingMd" as="h6">
            {title}
          </Text>
        </label>
        <HorizontalStack gap="2" align="center" blockAlign="center">
          {settingStatusMarkup}
        </HorizontalStack>
      </HorizontalStack>
    </HorizontalStack>
  ) : null;

  const actionMarkup = (
    <Button
      role="switch"
      id={toggleId}
      ariaChecked={enabled ? 'true' : 'false'}
      onClick={refreshEmbed}
      size="slim"
    >
      {contentStatus}
    </Button>
  );

  const headerMarkup = (
    <Box width="100%">
      <HorizontalStack
        gap="12"
        align="space-between"
        blockAlign="start"
        wrap={false}
      >
        {settingTitle}
        {!mdDown ? (
          <Box minWidth="fit-content">
            <HorizontalStack align="end">{actionMarkup}</HorizontalStack>
          </Box>
        ) : null}
      </HorizontalStack>
    </Box>
  );

  const descriptionMarkup = (
    <VerticalStack gap="4">
      {mdDown ? (
        <Box width="100%">
          <HorizontalStack align="start">{actionMarkup}</HorizontalStack>
        </Box>
      ) : null}
    </VerticalStack>
  );

  //ButtonGroup
  const [activeTypeButtonIndex, setActiveTypeButtonIndex] = useState(0);

  const handleTypeButtonClick = useCallback(
    (index) => {
      if (activeTypeButtonIndex === index) return;
      setActiveTypeButtonIndex(index);

      if (index === 0) {
        handleChangePosition("box-bottom-right");
      } else {
        handleChangePosition("banner-top");
      }
    },
    [activeTypeButtonIndex],
  );

  const [activeDeviceButtonIndex, setActiveDeviceButtonIndex] = useState(1);

  const handleDeviceButtonClick = useCallback(
    (index) => {
      if (activeDeviceButtonIndex === index) return;
      setActiveDeviceButtonIndex(index);
    },
    [activeDeviceButtonIndex],
  );

  useEffect(() => {
    if (widgetInfoResponse.data && widgetInfoResponse.data.length > 0) {
      setWidgetBackgroundColor_w(JSON.parse(widgetInfoResponse.data[0].bgColor));
      setWidgetTextColor_w(JSON.parse(widgetInfoResponse.data[0].textColor));
      setWidgetLinkColor_w(JSON.parse(widgetInfoResponse.data[0].linkColor));
      setWidgetBtnColor_w(JSON.parse(widgetInfoResponse.data[0].btnColor));
      setWidgetBtnBorderColor_w(JSON.parse(widgetInfoResponse.data[0].btnBorderColor));
      setWidgetBtnTextColor_w(JSON.parse(widgetInfoResponse.data[0].btnTextColor));
      setRichText_w(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(widgetInfoResponse.data[0].text))));
      setBtnText_w(widgetInfoResponse.data[0].btnText);
      setActiveTypeButtonIndex(widgetInfoResponse.data[0].type);
      setWidgetSize_w(widgetInfoResponse.data[0].size);
      setWidgetPosition(widgetInfoResponse.data[0].position);
      setWidgetTheme(widgetInfoResponse.data[0].theme);
      setWidgetAlign(widgetInfoResponse.data[0].align);
      setReviewWidgetVisible(widgetInfoResponse.data[0].reviewEnabled);
    };

  }, [widgetInfoResponse]);

  useEffect(() => {
    const colorBox = document.getElementsByClassName('custom');
    if (colorBox.length > 0) {
      colorBox[0].style.backgroundColor = `rgba(${widgetBackgroundColor_w.r}, ${widgetBackgroundColor_w.g}, ${widgetBackgroundColor_w.b}, ${widgetBackgroundColor_w.a})`;
    }
  }, [widgetBackgroundColor_w]);

  useEffect(() => {
    const colorBox = document.getElementsByClassName('custom');
    if (colorBox.length > 0) {
      colorBox[0].style.color = `rgba(${widgetTextColor_w.r}, ${widgetTextColor_w.g}, ${widgetTextColor_w.b}, ${widgetTextColor_w.a})`;
    }
  }, [widgetTextColor_w]);

  useEffect(() => {
    const colorBox = document.getElementsByClassName('custom');
    if (colorBox.length > 0) {
      const linkColorRgba = `rgba(${widgetLinkColor_w.r}, ${widgetLinkColor_w.g}, ${widgetLinkColor_w.b}, ${widgetLinkColor_w.a})`;
      const customElements = document.querySelectorAll('.custom');
      customElements.forEach(element => {
        const linkElements = element.getElementsByTagName('a');
        for (let i = 0; i < linkElements.length; i++) {
          linkElements[i].style.color = linkColorRgba;
        }
      });
    }
  }, [widgetLinkColor_w]);

  useEffect(() => {
    if (widgetTheme == 'custom') {
      const colorBox = document.getElementsByClassName('accept');
      if (colorBox.length > 0) {
        colorBox[0].style.backgroundColor = `rgba(${widgetBtnColor_w.r}, ${widgetBtnColor_w.g}, ${widgetBtnColor_w.b}, ${widgetBtnColor_w.a})`;
      }
    }
  }, [widgetBtnColor_w]);

  useEffect(() => {
    const colorBox = document.getElementsByClassName('accept');
    if (colorBox.length > 0) {
      colorBox[0].style.borderColor = `rgba(${widgetBtnBorderColor_w.r}, ${widgetBtnBorderColor_w.g}, ${widgetBtnBorderColor_w.b}, ${widgetBtnBorderColor_w.a})`;
    }
  }, [widgetBtnBorderColor_w]);

  useEffect(() => {
    const colorBox = document.getElementsByClassName('accept');
    if (colorBox.length > 0) {
      colorBox[0].style.color = `rgba(${widgetBtnTextColor_w.r}, ${widgetBtnTextColor_w.g}, ${widgetBtnTextColor_w.b}, ${widgetBtnTextColor_w.a})`;
    }
  }, [widgetBtnTextColor_w]);

  const handleSubmitWidget = useCallback(async () => {
    if (widgetInfoResponse.data.length == 0) {
      await createWidgetInfo({
        settingsInfo: {
          shop: {
            _link: shopResponse.data?.id,
          },
          bgColor: JSON.stringify(widgetBackgroundColor_w),
          textColor: JSON.stringify(widgetTextColor_w),
          linkColor: JSON.stringify(widgetLinkColor_w),
          btnColor: JSON.stringify(widgetBtnColor_w),
          btnBorderColor: JSON.stringify(widgetBtnBorderColor_w),
          btnTextColor: JSON.stringify(widgetBtnTextColor_w),
          size: widgetSize_w.toString(),
          type: activeTypeButtonIndex,
          text: stateToHTML(convertFromRaw(convertToRaw(richText_w.getCurrentContent()))),
          btnText: btnText_w,
          position: widgetPosition,
          theme: widgetTheme,
          align: widgetAlign,
          active: enabled,
          geo: widgetGeo,
          reviewEnabled: !reviewSubmitted,
        },
      });
    } else {
      await updateWidgetInfo({
        id: widgetInfoResponse.data[0].id,
        settingsInfo: {
          shop: {
            _link: shopResponse.data?.id,
          },
          bgColor: JSON.stringify(widgetBackgroundColor_w),
          textColor: JSON.stringify(widgetTextColor_w),
          linkColor: JSON.stringify(widgetLinkColor_w),
          btnColor: JSON.stringify(widgetBtnColor_w),
          btnBorderColor: JSON.stringify(widgetBtnBorderColor_w),
          btnTextColor: JSON.stringify(widgetBtnTextColor_w),
          size: widgetSize_w.toString(),
          type: activeTypeButtonIndex,
          text: stateToHTML(convertFromRaw(convertToRaw(richText_w.getCurrentContent()))),
          btnText: btnText_w,
          position: widgetPosition,
          theme: widgetTheme,
          align: widgetAlign,
          active: enabled,
          geo: widgetGeo,
          reviewEnabled: !reviewSubmitted,
        },
      });
    }

    setIsSaveSettingsModalOpen(true);
  }, [widgetInfoResponse, widgetBackgroundColor_w, widgetTextColor_w, widgetLinkColor_w, widgetBtnColor_w, widgetBtnBorderColor_w, widgetBtnTextColor_w, widgetSize_w, richText_w, btnText_w, createWidgetInfo, shopResponse, widgetPosition, widgetTheme, widgetAlign, activeTypeButtonIndex, enabled, widgetGeo]);

  const handleSaveSettingsModalClose = useCallback(() => {
    setIsSaveSettingsModalOpen(false);
  }, []);

  if (shopResponse.error) {
    return (
      <Layout>
        <Text variant="bodyMd" as="p">
          Error: {shopResponse.error.toString()}
        </Text>
      </Layout>
    );
  }

  const handleChangeModal = useCallback(() => setActiveModal(!activeModal), [activeModal]);

  const activator = <Button primary onClick={handleChangeModal}>Preview</Button>;

  const handleManualCheck = useCallback(
    (checked) => setManualCheckStatus(checked),
    [],
  );
  const handleRemoveCheck = useCallback(
    (checked) => setRemoveCheckStatus(checked),
    [],
  );
  const changeWidgetBackColor_w = useCallback(
    (value) => setWidgetBackgroundColor_w(value.rgb),
    [],
  );
  const changeWidgetTextColor_w = useCallback(
    (value) => setWidgetTextColor_w(value.rgb),
    [],
  );
  const changeWidgetLinkColor_w = useCallback(
    (value) => setWidgetLinkColor_w(value.rgb),
    [],
  );
  const changeWidgetBtnColor_w = useCallback(
    (value) => setWidgetBtnColor_w(value.rgb),
    [],
  );
  const changeWidgetBtnBorderColor_w = useCallback(
    (value) => setWidgetBtnBorderColor_w(value.rgb),
    [],
  );
  const changeWidgetBtnTextColor_w = useCallback(
    (value) => setWidgetBtnTextColor_w(value.rgb),
    [],
  );

  const changeWidgetSize_w = useCallback(
    (value) => {
      setWidgetSize_w(value);
    },
    [],
  );

  const changeRichText_w = useCallback(
    (value) => {
      setRichText_w(value);
    },
    [],
  );

  const changeBtnText_w = useCallback(
    (value) => {
      setBtnText_w(value);
    },
    [],
  );

  const changeWidgetGeo = useCallback(
    (value) => setWidgetGeo(value),
    [],
  );

  const handleChangePosition = (value) => {
    setWidgetPosition(value);
  };

  const handleChangeTheme = (value) => {
    setWidgetTheme(value);
  };

  const handleChangeAlign = (value) => {
    setWidgetAlign(value);
  };

  function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    } : null;
  };
  const formatHsbToHex = (hsb) => {
    const { hue, brightness, saturation } = hsb;
    const rgb = hsbToRgb(hue, brightness, saturation);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
  };


  function formatHexToHsb(hex) {
    if (hex[0] == '#' && ((hex.length == 4 && hex[1] <= 'f' && hex[2] <= 'f' && hex[3] <= 'f') || (hex.length == 7 && hex[1] <= 'f' && hex[2] <= 'f' && hex[3] <= 'f' && hex[4] <= 'f' && hex[5] <= 'f' && hex[6] <= 'f'))) return rgbToHsb(hexToRgb(hex));
    else return rgbToHsb(hexToRgb('#fff'));
  }

  const getColor = (value) => {
    return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
  }

  const togglePopoverActiveTextColor = useCallback(
    () => setPopoverActiveTextColor((popoverActiveTextColor) => !popoverActiveTextColor),
    [],
  );
  const activatorTextColor = (
    <div className="color-div-outer-box" onClick={togglePopoverActiveTextColor}>
      <div className="color-div-inner-box" style={{ backgroundColor: getColor(widgetTextColor_w) }}></div>
    </div>
  );

  const togglePopoverActiveBgColor = useCallback(
    () => setPopoverActiveBgColor((popoverActiveBgColor) => !popoverActiveBgColor),
    [],
  );
  const activatorBgColor = (
    <div className="color-div-outer-box" onClick={togglePopoverActiveBgColor}>
      <div className="color-div-inner-box" style={{ backgroundColor: getColor(widgetBackgroundColor_w) }}></div>
    </div>
  );
  const togglePopoverActiveLinkColor = useCallback(
    () => setPopoverActiveLinkColor((popoverActiveLinkColor) => !popoverActiveLinkColor),
    [],
  );
  const activatorLinkColor = (
    <div className="color-div-outer-box" onClick={togglePopoverActiveLinkColor}>
      <div className="color-div-inner-box" style={{ backgroundColor: getColor(widgetLinkColor_w) }}></div>
    </div>
  );
  const togglePopoverActiveBtnColor = useCallback(
    () => setPopoverActiveBtnColor((popoverActiveBtnColor) => !popoverActiveBtnColor),
    [],
  );
  const activatorBtnColor = (
    <div className="color-div-outer-box" onClick={togglePopoverActiveBtnColor}>
      <div className="color-div-inner-box" style={{ backgroundColor: getColor(widgetBtnColor_w) }}></div>
    </div>
  );
  const togglePopoverActiveBtnBorderColor = useCallback(
    () => setPopoverActiveBtnBorderColor((popoverActiveBtnBorderColor) => !popoverActiveBtnBorderColor),
    [],
  );
  const activatorBtnBorderColor = (
    <div className="color-div-outer-box" onClick={togglePopoverActiveBtnBorderColor}>
      <div className="color-div-inner-box" style={{ backgroundColor: getColor(widgetBtnBorderColor_w) }}></div>
    </div>
  );
  const togglePopoverActiveBtnTextColor = useCallback(
    () => setPopoverActiveBtnTextColor((popoverActiveBtnTextColor) => !popoverActiveBtnTextColor),
    [],
  );
  const activatorBtnTextColor = (
    <div className="color-div-outer-box" onClick={togglePopoverActiveBtnTextColor}>
      <div className="color-div-inner-box" style={{ backgroundColor: getColor(widgetBtnTextColor_w) }}></div>
    </div>
  );
  return (
    <div className="setting">
      <LegacyCard>
      </LegacyCard>
      <LegacyCard>
        <Form onSubmit={handleSubmitWidget}>
          <FormLayout>
            <Layout>
              <Layout.Section oneThird>
                <LegacyCard title="Customize Banner Settings" sectioned>
                  <div>
                    <div>
                      <VerticalStack gap={{ xs: '4', sm: '5' }}>
                        <Box width="100%">
                          <VerticalStack gap={{ xs: '2', sm: '4' }}>
                            {headerMarkup}
                            {descriptionMarkup}
                          </VerticalStack>
                        </Box>
                      </VerticalStack>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <p className="custom-title">Country/Region to show banner:</p>
                      <Select
                        label=""
                        options={[
                          { label: "EU", value: "EU" },
                          { label: "Worldwide", value: "All" },
                          { label: "USA", value: "US" },
                          { label: "Brazil", value: "BR" },
                          { label: "Japan", value: "JP" },
                          { label: "Canada", value: "CA" },
                          { label: "Thailand", value: "TH" },
                        ]}
                        value={widgetGeo}
                        onChange={changeWidgetGeo}
                      />
                    </div>
                  </div>
                  <p className="mb-3 mt-3">Change the appearance of the GDPR banner to match your brand's style.</p>
                  <div className="sub-content">
                    <p className="custom-title">
                      Banner Type:
                    </p>
                    <div className="fullwidth-buttongroup-container d-flex mb-3" style={{ width: '100%' }}>
                      <ButtonGroup segmented fullWidth >
                        <Button primary={activeTypeButtonIndex === 0}
                          onClick={() => handleTypeButtonClick(0)}
                        >
                          <div><div className={"card " + (activeTypeButtonIndex === 0 ? "primary" : "")}></div>Card</div>
                        </Button>
                        <Button primary={activeTypeButtonIndex === 1}
                          onClick={() => handleTypeButtonClick(1)}
                        >
                          <div><div className={"bar " + (activeTypeButtonIndex === 1 ? "primary" : "")}></div>Bar</div>
                        </Button>
                      </ButtonGroup>
                    </div>
                    {activeTypeButtonIndex === 0 && <div>
                      <p className="custom-title">
                        Position:
                      </p>
                      <div className="d-flex mb-3 justify-space-between">
                        <div className={"custom-item " + (widgetPosition == "box-top-left" ? "active" : "")} onClick={() => handleChangePosition("box-top-left")}>
                          <img width="300" src="/assets/position/box-top-left.svg" />
                        </div>
                        <div className={"custom-item " + (widgetPosition == "box-top-right" ? "active" : "")} onClick={() => handleChangePosition("box-top-right")}>
                          <img width="300" src="/assets/position/box-top-right.svg" />
                        </div>
                      </div>
                      <div className="d-flex mb-3 justify-space-between">
                        <div className={"custom-item " + (widgetPosition == "box-bottom-left" ? "active" : "")} onClick={() => handleChangePosition("box-bottom-left")}>
                          <img width="300" src="/assets/position/box-bottom-left.svg" />
                        </div>
                        <div className={"custom-item " + (widgetPosition == "box-bottom-right" ? "active" : "")} onClick={() => handleChangePosition("box-bottom-right")}>
                          <img width="300" src="/assets/position/box-bottom-right.svg" />
                        </div>
                      </div>
                    </div>
                    }
                    {activeTypeButtonIndex === 1 && <div>
                      <p className="custom-title">
                        Position:
                      </p>
                      <div className="d-flex mb-3 justify-space-between">
                        <div className={"custom-item " + (widgetPosition == "banner-top" ? "active" : "")} onClick={() => handleChangePosition("banner-top")}>
                          <img width="300" src="/assets/position/banner-top.svg" />
                        </div>
                        <div className={"custom-item " + (widgetPosition == "banner-bottom" ? "active" : "")} onClick={() => handleChangePosition("banner-bottom")}>
                          <img width="300" src="/assets/position/banner-bottom.svg" />
                        </div>
                      </div>
                    </div>
                    }

                    <div style={{ display: activeTypeButtonIndex === 0 ? 'none' : 'block' }}>
                      <p className="custom-title">
                        Alignment:
                      </p>
                      <div className="fullwidth-buttongroup-container d-flex mb-3" style={{ width: '100%' }}>
                        <ButtonGroup segmented fullWidth >
                          <Button primary={widgetAlign === 0} onClick={() => handleChangeAlign(0)}>
                            <div className={"align-item tight " + (widgetAlign === 0 ? "primary" : "")}><div></div><div></div></div>
                          </Button>
                          <Button primary={widgetAlign === 1} onClick={() => handleChangeAlign(1)}>
                            <div className={"align-item wide " + (widgetAlign === 1 ? "primary" : "")}><div></div><div></div></div>
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>

                  <div className="sub-content">
                    <p className="custom-title">
                      Theme:
                    </p>
                    <div className="d-flex">
                      <div className={"theme-item " + (widgetTheme == "light" ? "active" : "")} onClick={() => handleChangeTheme("light")}>
                        <div className="item light">
                          <div className="text">Light</div>
                        </div>
                      </div>
                      <div className={"theme-item " + (widgetTheme == "dark" ? "active" : "")} onClick={() => handleChangeTheme("dark")}>
                        <div className="item dark">
                          <div className="text">Dark</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sub-content">
                    <p className="custom-title">
                      Customize:
                    </p>
                    <div className="d-flex justify-content-center customize-banner">
                      <div>
                        <CalloutCard
                          primaryAction={{
                            content: 'Customize banner',
                            onClick: () => handleChangeTheme("custom")
                          }}
                        >
                        </CalloutCard>
                      </div>
                    </div>
                    <div>
                      {widgetTheme == "custom" && <div style={{ marginTop: '10px' }}>
                        <div className="color-div">
                          <div className="color-div-label">Background Color</div>
                          <Popover
                            active={popoverActiveBgColor}
                            activator={activatorBgColor}
                            onClose={togglePopoverActiveBgColor}
                            ariaHaspopup={false}
                            sectioned
                          >
                            <FormLayout>
                              <SketchPicker
                                color={widgetBackgroundColor_w}
                                onChange={changeWidgetBackColor_w}
                              />
                            </FormLayout>
                          </Popover>
                        </div>
                        <div className="color-div">
                          <div className="color-div-label">Text Color</div>
                          <Popover
                            active={popoverActiveTextColor}
                            activator={activatorTextColor}
                            onClose={togglePopoverActiveTextColor}
                            ariaHaspopup={false}
                            sectioned
                          >
                            <FormLayout>
                              <SketchPicker
                                color={widgetTextColor_w}
                                onChange={changeWidgetTextColor_w}
                              />
                            </FormLayout>
                          </Popover>
                        </div>
                        <div className="color-div">
                          <div className="color-div-label">Link Color</div>
                          <Popover
                            active={popoverActiveLinkColor}
                            activator={activatorLinkColor}
                            onClose={togglePopoverActiveLinkColor}
                            ariaHaspopup={false}
                            sectioned
                          >
                            <FormLayout>
                              <SketchPicker
                                color={widgetLinkColor_w}
                                onChange={changeWidgetLinkColor_w}
                              />
                            </FormLayout>
                          </Popover>
                        </div>
                        <div className="color-div">
                          <div className="color-div-label">Button Color</div>
                          <Popover
                            active={popoverActiveBtnColor}
                            activator={activatorBtnColor}
                            onClose={togglePopoverActiveBtnColor}
                            ariaHaspopup={false}
                            sectioned
                          >
                            <FormLayout>
                              <SketchPicker
                                color={widgetBtnColor_w}
                                onChange={changeWidgetBtnColor_w}
                              />
                            </FormLayout>
                          </Popover>
                        </div>
                        <div className="color-div">
                          <div className="color-div-label">Button Border Color</div>
                          <Popover
                            active={popoverActiveBtnBorderColor}
                            activator={activatorBtnBorderColor}
                            onClose={togglePopoverActiveBtnBorderColor}
                            ariaHaspopup={false}
                            sectioned
                          >
                            <FormLayout>
                              <SketchPicker
                                color={widgetBtnBorderColor_w}
                                onChange={changeWidgetBtnBorderColor_w}
                              />
                            </FormLayout>
                          </Popover>
                        </div>
                        <div className="color-div">
                          <div className="color-div-label">Button Text Color</div>
                          <Popover
                            active={popoverActiveBtnTextColor}
                            activator={activatorBtnTextColor}
                            onClose={togglePopoverActiveBtnTextColor}
                            ariaHaspopup={false}
                            sectioned
                          >
                            <FormLayout>
                              <SketchPicker
                                color={widgetBtnTextColor_w}
                                onChange={changeWidgetBtnTextColor_w}
                              />
                            </FormLayout>
                          </Popover>
                        </div>
                      </div>
                      }
                    </div>
                  </div>

                  <div className="sub-content" style={{ marginTop: '10px' }}>
                    <p className="custom-title">
                      Text Settings:
                    </p>
                    <div>
                      <RangeSlider
                        value={widgetSize_w}
                        onChange={changeWidgetSize_w}
                        min={12}
                        max={20}
                        step={1}
                        output
                        label="Font Size:"
                      />
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <Select
                        label="Font Type:"
                        options={[
                          { label: 'Arial', value: 'Arial' },
                          { label: 'Arial Narrow', value: 'Arial Narrow' },
                          { label: 'Calibri', value: 'Calibri' },
                          { label: 'Courier New', value: 'Courier New' },
                          { label: 'Comic Sans MS', value: 'Comic Sans MS' },
                          { label: 'Garamond', value: 'Garamond' },
                          { label: 'Georgia', value: 'Georgia' },
                          { label: 'Helvetica', value: 'Helvetica' },
                          { label: 'Impact', value: 'Impact' },
                          { label: 'Lucida Sans Unicode', value: 'Lucida Sans Unicode' },
                          { label: 'Palatino', value: 'Palatino' },
                          { label: 'Tahoma', value: 'Tahoma' },
                          { label: 'Trebuchet MS', value: 'Trebuchet MS' },
                          { label: 'Times New Roman', value: 'Times New Roman' },
                          { label: 'Verdana', value: 'Verdana' },
                        ]}
                        value={selectedFont}
                        onChange={handleFontChange}
                      />
                    </div>

                    <p style={{ marginTop: '20px' }}>Banner Text:</p>
                    <div>
                      <Editor
                        editorState={richText_w}
                        onEditorStateChange={changeRichText_w}
                        toolbar={textToolbarConfig}
                      />
                    </div>

                    <p style={{ marginTop: '20px' }}>Button Text:</p>
                    <TextField
                      value={btnText_w}
                      onChange={(value) => setBtnText_w(value)}
                    />
                  </div>

                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button primary submit>
                      Save Settings
                    </Button>
                  </div>
                </LegacyCard>
              </Layout.Section>
              <Layout.Section twoThird>
                <LegacyCard title="Preview" sectioned>
                  <div className="preview-store-link" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <LegacyStack alignment="center">
                      <LegacyStack.Item fill>
                        <Text variant="headingMd">
                          Store Preview
                        </Text>
                      </LegacyStack.Item>
                      <LegacyStack.Item>
                        {shopResponse?.data?.domain && (
                          <Link url={`https://${shopResponse.data.domain}`} external>
                            <img width="15" src="/assets/link.svg" />
                          </Link>
                        )}
                      </LegacyStack.Item>
                    </LegacyStack>
                  </div>
                  <div className="preview-buttongroup-container" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <ButtonGroup segmented>
                      <Button primary={activeDeviceButtonIndex === 0}
                        onClick={() => handleDeviceButtonClick(0)}
                      >
                        <div>
                          <div>
                            <Icon
                              source={MobileMajor}
                              color="base"
                            /></div>Mobile</div>
                      </Button>
                      <Button primary={activeDeviceButtonIndex === 1}
                        onClick={() => handleDeviceButtonClick(1)}
                      >
                        <div>
                          <div><Icon
                            source={DesktopMajor}
                            color="base"
                          /></div>Desktop</div>
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className="previewPanel" style={{
                    maxWidth: activeDeviceButtonIndex === 0 ? "500px" : "100%", margin: "auto", fontSize: `${widgetSize_w}px`, fontFamily: `${selectedFont}`
                  }}>
                    <div className="ph-item ph-mb-0">
                      <div>
                        <div className="ph-row ph-justify-content-between ph-align-content-end ph-mt-0">
                          <div className="ph-div-md ph-br-8 ph-bg-color"></div>
                          <div className="ph-col-6 ph-bg-none ph-d-flex ph-justify-content-between">
                            <div className="ph-div-sm ph-mt-0 ph-bg-color ph-br-8"></div>
                            <div className="ph-div-sm ph-mt-0 ph-bg-color ph-br-8"></div>
                            <div className="ph-div-sm ph-mt-0 ph-bg-color ph-br-8"></div>
                            <div className="ph-div-sm ph-mt-0 ph-bg-color ph-br-8"></div>
                          </div>
                        </div>
                      </div>
                      <div className="ph-col-12">
                        <div className="ph-row">
                          <div className="ph-col-12 ph-h-3 ph-br-8 ph-bg-color"></div>
                        </div>
                      </div>
                      <div className="ph-col-12 ph-mb-0">
                        <div className="ph-picture-xl ph-br-8 ph-bg-color"></div>
                      </div>
                      <div className="ph-col-12 ph-mb-0">
                        <div className="ph-row">
                          <div className="ph-col-12 ph-h-25 ph-br-8 ph-my-30 ph-bg-color"></div>
                        </div>
                      </div>
                      <div className="ph-flex-row ph-justify-content-between">
                        <div className="ph-col-5">
                          <div className="ph-col-5 ph-h-38 ph-br-12 ph-bg-color"></div>
                          <div className="ph-col-5 ph-h-38 ph-br-12 ph-bg-color"></div>
                          <div className="ph-col-5 ph-h-38 ph-br-12 ph-bg-color"></div>
                        </div>
                        <div className="ph-col-6">
                          <div className="ph-picture-l ph-br-8 ph-bg-color"></div>
                        </div>
                      </div>
                      <div className="ph-col-12 ph-mb-0">
                        <div className="ph-row">
                          <div className="ph-col-12 ph-h-25 ph-br-8 ph-my-18 ph-bg-color"></div>
                        </div>
                      </div>
                      <div className="ph-col-12 ph-mb-0">
                        <div className="ph-row">
                          <div className="ph-col-12 ph-h-25 ph-br-8 ph-my-18 ph-bg-color"></div>
                        </div>
                      </div>
                    </div>
                    {
                      widgetTheme == "custom" && enabled &&
                      <div className={"consent " + widgetPosition + " " + widgetTheme + " " + widgetSize_w + " " + widgetAlign} style={{
                        backgroundColor: `rgba(${widgetBackgroundColor_w.r}, ${widgetBackgroundColor_w.g}, ${widgetBackgroundColor_w.b}, ${widgetBackgroundColor_w.a})`, maxWidth: activeDeviceButtonIndex === 0 ? "500px" : "100%"
                      }}>
                        <div style={{ textAlign: 'right' }}><button className="reject" onClick={(e) => { e.preventDefault(); }}><Icon source={CancelSmallMinor} color="base" /></button></div>
                        <div style={{ display: activeTypeButtonIndex === 0 ? "block" : "flex", alignItems: "center", justifyContent: activeDeviceButtonIndex === 0 ? '' : (widgetAlign === 1 ? 'space-between' : 'space-around') }}>
                          <div style={{
                            color: `rgba(${widgetTextColor_w.r}, ${widgetTextColor_w.g}, ${widgetTextColor_w.b}, ${widgetTextColor_w.a})`, backgroundColor: `rgba(${widgetBtnColor_w.r}, ${widgetBtnColor_w.g}, ${widgetBtnColor_w.b}, ${widgetBtnColor_w.a})`, borderColor: `rgba(${widgetBtnBorderColor_w.r}, ${widgetBtnBorderColor_w.g}, ${widgetBtnBorderColor_w.b}, ${widgetBtnBorderColor_w.a})`, marginBottom: activeTypeButtonIndex === 0 ? '8px' : '', textAlign: activeTypeButtonIndex === 0 ? "center" : '', marginRight: activeTypeButtonIndex === 0 ? '' : '15px', backgroundColor: `rgba(${widgetBackgroundColor_w.r}, ${widgetBackgroundColor_w.g}, ${widgetBackgroundColor_w.b}, ${widgetBackgroundColor_w.a})`
                          }}>
                            {ReactHtmlParser(stateToHTML(convertFromRaw(convertToRaw(richText_w.getCurrentContent()))))}
                          </div>

                          <div style={{ color: `rgba(${widgetBtnTextColor_w.r}, ${widgetBtnTextColor_w.g}, ${widgetBtnTextColor_w.b}, ${widgetBtnTextColor_w.a})`, textAlign: activeTypeButtonIndex === 0 ? 'center' : '', paddingTop: activeTypeButtonIndex === 0 ? "0.5rem" : '' }}>
                            <button className="accept" style={{ fontFamily: `${selectedFont}`, width: activeTypeButtonIndex === 0 ? '' : '100% !important' }} onClick={(e) => { e.preventDefault(); }}>{btnText_w}</button></div>
                        </div>
                      </div>
                    }
                    {
                      widgetTheme != "custom" && enabled &&
                      <div className={"consent " + widgetPosition + " " + widgetTheme + " " + widgetSize_w + " " + widgetAlign + " " + (activeTypeButtonIndex === 0 ? 'cardView' : 'barView')} style={{
                        maxWidth: activeDeviceButtonIndex === 0 ? "500px" : "100%"
                      }}>
                        <div style={{ textAlign: 'right' }}><button className="reject" onClick={(e) => { e.preventDefault(); }}><Icon source={CancelSmallMinor} color="base" /></button></div>
                        <div style={{ display: activeTypeButtonIndex === 0 ? "block" : "flex", alignItems: "center", justifyContent: activeDeviceButtonIndex === 0 ? '' : (widgetAlign === 1 ? 'space-between' : 'space-around') }}>
                          <div style={{ marginBottom: activeTypeButtonIndex === 0 ? '8px' : '', textAlign: activeTypeButtonIndex === 0 ? "center" : '', marginRight: activeTypeButtonIndex === 0 ? '' : '15px' }}
                          >
                            {ReactHtmlParser(stateToHTML(convertFromRaw(convertToRaw(richText_w.getCurrentContent()))))}
                          </div>
                          <div style={{ textAlign: activeTypeButtonIndex === 0 ? 'center' : '', paddingTop: activeTypeButtonIndex === 0 ? "0.5rem" : '' }}>
                            <button className="accept" style={{ fontFamily: `${selectedFont}` }} onClick={(e) => { e.preventDefault(); }}>{btnText_w}</button></div>
                        </div>
                      </div>
                    }
                  </div>
                </LegacyCard>
                {reviewWidgetVisible && (
                  <div className="reviewCard">
                    <LegacyCard
                      title="Help us and others with your review, thanks!" sectioned
                      actions={[
                        {
                          content: (
                            <div onClick={() => setReviewWidgetVisible(false)}>
                              <Icon source={CancelSmallMinor} color="base" />
                            </div>
                          ),
                          onAction: () => {
                            setReviewWidgetVisible(false);
                            setReviewSubmitted(true);
                            handleSubmitWidget();
                          },
                        },
                      ]}
                    >
                      <div>
                        <div className="star-container" onMouseLeave={() => setHoveredStars(0)}>
                          {Array.from({ length: 5 }, (_, index) => renderStarIcon(index))}
                          <Button primary onClick={handleSubmitReview}>
                            Leave Review
                          </Button>
                        </div>
                      </div>
                    </LegacyCard>
                  </div>
                )}
              </Layout.Section>
            </Layout>
          </FormLayout>
        </Form>
      </LegacyCard>

      {/* Save Settings Modal */}
      <Modal
        open={isSaveSettingsModalOpen}
        onClose={handleSaveSettingsModalClose}
        title="Settings saved successfully!"
        primaryAction={{
          content: 'Okay',
          onAction: handleSaveSettingsModalClose,
        }}
      >
      </Modal>

      {/* Review Modal */}
      <Modal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Leave a Review"
        primaryAction={{
          content: "Submit",
          onAction: () => {
            setReviewMessage("");
            setShowReviewModal(false);
            setReviewSubmitted(true);
            setReviewWidgetVisible(false);
            handleSubmitWidget();
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setReviewMessage("");
              setShowReviewModal(false);
            },
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSubmitReview}>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Your Review:"
                  value={reviewMessage}
                  onChange={(value) => setReviewMessage(value)}
                  multiline={5}
                />
              </FormLayout.Group>
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>

      {
        reviewSubmitted && (
          <Banner
            title="Thank you for submitting your review!"
            status="success"
            onDismiss={() =>
              setReviewSubmitted(false)
            }
          />
        )
      }

      <IntercomChat />
    </div >
  );
};

export default SettingsPage;