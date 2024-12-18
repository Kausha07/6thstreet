import React from "react";
import { connect } from "react-redux";

import { showNotification } from "Store/Notification/Notification.action";

import { Email, Link, WhatsApp, Facebook, Pinterest } from "Component/Icons";

import { isArabic } from "Util/App";

import "./SocialMediaOverlay.style";

export const mapDispatchToProps = (dispatch) => ({
  showSuccessNotification: (message) =>
    dispatch(showNotification("success", message)),
  showErrorNotification: (error) =>
    dispatch(showNotification("error", error[0].message)),
});

const SocialMediaOverlay = (props) => {
  const copyToClipboard = async () => {
    const { showSuccessNotification, showErrorNotification } = props;
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccessNotification(__("Link copied to clipboard"));
    } catch (err) {
      console.error(err);
      showErrorNotification(__("Something went wrong! Please, try again!"));
    }
  };

  const renderMap = [
    {
      title: "WhatsApp",
      icon: <WhatsApp />,
      handleClick: (text, title, url, image) =>
        window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank"),
      render: true,
    },
    {
      title: "Facebook",
      icon: <Facebook />,
      handleClick: (text, title, url, image) => {
        if (FB) {
          FB.ui({
            method: "share",
            href: url,
          });
        } else {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?${url}`,
            "_blank"
          );
        }
      },
      render: true,
    },
    {
      title: "Copy Link",
      icon: <Link />,
      handleClick: copyToClipboard,
      render: !!navigator?.clipboard,
    },
    {
      title: "Mail",
      icon: <Email />,
      handleClick: (text, title, url, image) =>
        window.open(`mailto:?&&subject=${title}&cc=&bcc=&body=${text} ${url}`),
      render: true,
    },
    {
      title: "Pinterest",
      icon: <Pinterest />,
      handleClick: (text, title, url, image) =>
        window.open(
          `https://pinterest.com/pin/create/button?url=${url}&media=${image}&description=${text}`,
          "_blank"
        ),
      render: true,
    },
  ];

  const renderShareButtons = () => {
    const {
      text = "",
      title = "",
      url = window.location.href,
      image = "",
    } = props;
    return (
      <>
        {renderMap.map(({ title, icon, handleClick }) => (
          <button
            key={title}
            onClick={() => {
              {
                handleClick(text, title, url, image);
              }
            }}
          >
            {icon}
          </button>
        ))}
      </>
    );
  };
  const renderOverlay = () => {
    return (
      <div
        block={`shareBlock  ${
          window.location.pathname.includes("influencer.html/Collection")
            ? "collectionBlock"
            : "storeBlock"
        }`}
        mods={{ isArabic: isArabic() }}
      >
        <h3 block="h3" mods={{ isArabic: isArabic() }}>
          {__("SHARE")}
        </h3>
        <div block="Overlay" elem="ButtonsContainer">
          {renderShareButtons()}
        </div>
      </div>
    );
  };

  return <div>{renderOverlay()}</div>;
};

export default connect(null, mapDispatchToProps)(SocialMediaOverlay);
