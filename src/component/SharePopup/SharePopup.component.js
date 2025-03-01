import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { showNotification } from "Store/Notification/Notification.action";
import Overlay from "SourceComponent/Overlay";
import { Email, Link, WhatsApp, Facebook, Pinterest } from "Component/Icons";
import { isArabic } from "Util/App";
import Event,{
  EVENT_WHATSAPP_SHARE,
  EVENT_FB_SHARE,
  EVENT_PINTEREST_SHARE,
  EVENT_MAIL_SHARE,
  EVENT_GTM_PDP_TRACKING,
  MOE_trackEvent
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { SHARE_POPUP_ID } from "./SharePopup.config";
import "./SharePopup.style";

export const mapDispatchToProps = (dispatch) => ({
  showSuccessNotification: (message) =>
    dispatch(showNotification("success", message)),
  showErrorNotification: (error) =>
    dispatch(showNotification("error", error[0].message)),
});

class SharePopup extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    showShareOverlay: PropTypes.func.isRequired,
    hideShareOverlay: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired,
    showErrorNotification: PropTypes.func.isRequired,
  };

  copyToClipboard = async () => {
    const { showSuccessNotification, showErrorNotification, isReferral, text } = this.props;
    try {
      if (isReferral && text){
        await navigator.clipboard.writeText(text);
        showSuccessNotification(__("Copied to clipboard"));
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccessNotification(__("Link copied to clipboard"));
      }
    } catch (err) {
      console.error(err);
      showErrorNotification(__("Something went wrong! Please, try again!"));
    }
  };

  renderMap = [
    {
      title: "WhatsApp",
      icon: <WhatsApp />,
      handleClick: (text, title, url, image) =>{
        const { isReferral } = this.props;
        if( isReferral ){
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank")
        } else{
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%0A%0A${url}`, "_blank")
        }
      },
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
          const { isReferral } = this.props;
          if(isReferral){
            window.open(
              `https://www.facebook.com/sharer/sharer.php?${encodeURIComponent(text)}`,
              "_blank"
            );
          } else{
            window.open(
              `https://www.facebook.com/sharer/sharer.php?${url}`,
              "_blank"
            );
          }
        }
      },
      render: true,
    },
    {
      title: "Copy Link",
      icon: <Link />,
      handleClick: this.copyToClipboard,
      render: !!navigator?.clipboard,
    },
    {
      title: "Mail",
      icon: <Email />,
      handleClick: (text, title, url, image) =>{
        const { isReferral } = this.props;
        if( isReferral ){
          window.open(`mailto:?&&subject=${title}&cc=&bcc=&body=${encodeURIComponent(text)}`)
        } else{
          window.open(`mailto:?&&subject=${title}&cc=&bcc=&body=${encodeURIComponent(text)}%0A%0A${url}`)
        }
      },
      render: true,
    },
    {
      title: "Pinterest",
      icon: <Pinterest />,
      handleClick: (text, title, url, image) =>
        window.open(
          `https://pinterest.com/pin/create/button?url=${url}&media=${image}&description=${encodeURIComponent(text)}`,
          "_blank"
        ),
      render: true,
    },
  ];
  sendMoeImpressions(title) {
    const { product } = this.props;
    if(product){
      const {
        product: { name, sku, url },
      } = this.props;
      const MoeEvent =
        title == "WhatsApp"
          ? EVENT_WHATSAPP_SHARE
          : title == "Facebook"
          ? EVENT_FB_SHARE
          : title == "Mail"
          ? EVENT_MAIL_SHARE
          : title == "Pinterest"
          ? EVENT_PINTEREST_SHARE
          : "";
      if (MoeEvent && MoeEvent.length > 0) {
        MOE_trackEvent(MoeEvent, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          product_name: name ? name : "",
          product_sku: sku ? sku : "",
          product_url : url ? url : "",
          app6thstreet_platform: "Web",
        });
      }
      const eventData = {
        name: MoeEvent,
        action: MoeEvent + "_click",
        product_name: name,
        product_id: sku,
      };
      Event.dispatch(EVENT_GTM_PDP_TRACKING, eventData);
    }
  }
  renderShareButtons = () => {
    const {
      text = "",
      title = "",
      url = window.location.href,
      image = "",
    } = this.props;

    return this.renderMap
      .filter(({ render }) => render)
      .map(({ title, icon, handleClick }) => (
        <button
          key={title}
          onClick={() => {
            {
              handleClick(text, title, url, image);
              this.sendMoeImpressions(title);
            }
          }}
        >
          {icon}
        </button>
      ));
  };

  render() {
    const { hideShareOverlay, open, openShareOverlay } = this.props;
    return (
      <>
      {
        openShareOverlay && <div className="closeSharePopUp" onClick={() => hideShareOverlay()}>
          {/* closes share popup */}
        </div>
      }
    
        <Overlay
          id={SHARE_POPUP_ID}
          mix={{
            block: "Overlay",
            mods: {
              isArabic: isArabic(),
            },
          }}
          onHide={hideShareOverlay}
          open={open}
          isRenderInPortal={false}
        >
          <h3>{__("SHARE")}</h3>
          <div block="Overlay" elem="ButtonsContainer">
            {this.renderShareButtons()}
          </div>
        </Overlay>
      </>
    );
  }
}

export default connect(null, mapDispatchToProps)(SharePopup);
