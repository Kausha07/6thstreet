import PropTypes from "prop-types";
import { PureComponent } from "react";

import DynamicContentBanner from "Component/DynamicContentBanner/DynamicContentBanner.component";

class MenuBannerContainer extends PureComponent {
  static propTypes = {
    image_url: PropTypes.string.isRequired,
    link: PropTypes.string,
    toggleMobileMenuSideBar: PropTypes.any,
  };

  static defaultProps = {
    link: "",
  };

  containerProps = () => {
    const { image_url, link, description, button_label, toggleMobileMenuSideBar } = this.props;

    // format it to dynamic content style
    return {
      items: [
        {
          url: image_url,
          link,
          description,
          button_label
        },
      ],
      isMenu: true,
      toggleMobileMenuSideBar,
    };
  };

  render() {
    return (
      <DynamicContentBanner
        doNotTrackImpression={true}
        setLastTapItemOnHome={this.props.setLastTapItemOnHome}
        {...this.containerProps()}
      />
    );
  }
}

export default MenuBannerContainer;
