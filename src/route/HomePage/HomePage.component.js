import PropTypes from "prop-types";
import { PureComponent } from "react";

import DynamicContent from "Component/DynamicContent";
import LoginBlockContainer from "Component/LoginBlock";
import { DynamicContent as DynamicContentType } from "Util/API/endpoint/StaticFiles/StaticFiles.type";
import MyAccountOverlay from "Component/MyAccountOverlay";

import "./HomePage.style";

class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      signInPopUp: "",
    };
  }
  static propTypes = {
    dynamicContent: DynamicContentType.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  closePopup = () => {
    this.setState({ signInPopUp: "" });
  };

  renderMySignInPopup = () => {
    const { signInPopUp } = this.state;
    const popUpElement = (
      <MyAccountOverlay isPopup={signInPopUp} closePopup={this.closePopup} />
    );

    this.setState({ signInPopUp: popUpElement });
    return popUpElement;
  };
  componentDidUpdate() {
    const DynamicContent = document.getElementsByClassName("DynamicContent")[0];

    if (DynamicContent) {
      const { children = [] } = DynamicContent;
      const { href } = location;

      if (children) {
        // eslint-disable-next-line
        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeName === "HR") {
            children[i].style.backgroundColor = "#EFEFEF";
            children[i].style.height = "1px";
          } else if (
            children[i].className === "DynamicContentBanner" &&
            children[i].children[0] &&
            children[i].children[0].href !== `${href}#`
          ) {
            children[i].style.maxHeight = `${children[i].dataset.maxHeight}px`;
            children[i].style.maxWidth = `${children[i].dataset.maxWidth}px`;
            children[i].style.display = "inline-block";
          }
        }
      }
    }
  }

  renderDynamicContent() {
    const { dynamicContent, gender } = this.props;

    return (
      <DynamicContent
        gender={gender}
        content={dynamicContent}
        renderMySignInPopup={this.renderMySignInPopup}
      />
    );
  }

  renderLoginBlock() {
    return <LoginBlockContainer />;
  }

  renderLoading() {
    return (
      <>
        {this.renderBannerAnimation()}
        {this.renderDynamiContentWithLabelAnimation()}
      </>
    );
  }

  renderBannerAnimation() {
    return <div block="AnimationWrapper"></div>;
  }
  renderDynamiContentWithLabelAnimation() {
    return (
      <div block="Wrapper">
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
        <div block="Wrapper" elem="Card"></div>
      </div>
    );
  }

  renderContent() {
    const { isLoading } = this.props;

    if (isLoading) {
      return this.renderLoading();
    }

    return this.renderDynamicContent();
  }

  render() {
    const { signInPopUp } = this.state;
    return (
      <main block="HomePage">
        {signInPopUp}
        {this.renderContent()}
      </main>
    );
  }
}

export default HomePage;
