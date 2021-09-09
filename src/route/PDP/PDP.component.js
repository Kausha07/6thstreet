/* eslint-disable fp/no-let */
/* eslint-disable max-len */
import PDPDetail from "Component/PDPDetail";
import PDPDetailsSection from "Component/PDPDetailsSection";
import PDPMainSection from "Component/PDPMainSection";
import PDPMixAndMatch from "Component/PDPMixAndMatch";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import NoMatch from "Route/NoMatch";
import "./PDP.style";
import MyAccountOverlay from "Component/MyAccountOverlay";

class PDP extends PureComponent {
  static propTypes = {
    nbHits: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  state = {
    signInPopUp: "",
    showPopup:false
  };


  showMyAccountPopup = () => {
    this.setState({ showPopup: true });
  };

  closePopup = () => {
    this.setState({ signInPopUp: "",showPopup:false });
  };

  onSignIn = () => {
    this.closePopup();
  };


  renderMySignInPopup() {
    const { showPopup } = this.state;
    if (!showPopup) {
      return null;
    }
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }
  renderMainSection() {
    return <PDPMainSection renderMySignInPopup={this.showMyAccountPopup} />;
  }

  renderDetailsSection() {
    return (
      <PDPDetailsSection
        {...this.props}
        renderMySignInPopup={this.showMyAccountPopup}
      />
    );
  }

  renderMixAndMatchSection() {
    return <PDPMixAndMatch renderMySignInPopup={this.showMyAccountPopup} />;
  }

  renderDetail() {
    return <PDPDetail {...this.props} />;
  }

  renderPDP() {
    const { nbHits, isLoading } = this.props;
    if (!isLoading) {
      return nbHits === 1 ? (
        <div block="PDP">
          {this.renderMySignInPopup()}
          {this.renderMainSection()}
          {this.renderMixAndMatchSection()}
          {this.renderDetailsSection()}
          {this.renderDetail()}
        </div>
      ) : (
        <NoMatch />
      );
    }

    return <div>loading...</div>;
  }

  render() {
    return this.renderPDP();
  }
}

export default PDP;
