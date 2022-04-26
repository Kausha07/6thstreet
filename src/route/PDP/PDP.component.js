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
import isMobile from "Util/Mobile";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import Loader from "Component/Loader";
import { connect } from "react-redux";

export const mapStateToProps = (state) => ({
  displaySearch: state.PDP.displaySearch,
});

export const mapDispatchToProps = (dispatch) => ({
  showPDPSearch: (displaySearch) =>
    PDPDispatcher.setPDPShowSearch({ displaySearch }, dispatch),
});

class PDP extends PureComponent {
  static propTypes = {
    nbHits: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  state = {
    signInPopUp: "",
    showPopup: false,
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  showMyAccountPopup = () => {
    this.setState({ showPopup: true });
  };

  closePopup = () => {
    this.setState({ signInPopUp: "", showPopup: false });
  };

  onSignIn = () => {
    this.closePopup();
  };

  onPDPPageClicked = () => {
    const { showPDPSearch, displaySearch } = this.props;
    if (displaySearch) {
      showPDPSearch(false);
    }
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
    return (
      <PDPMainSection
        renderMySignInPopup={this.showMyAccountPopup}
        {...this.props}
      />
    );
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
    const { isMobile } = this.state;
    if (isMobile) {
      return null;
    }
    return <PDPDetail {...this.props} />;
  }

  renderSeperator() {
    const { isMobile } = this.state;
    return <div block="Seperator" mods={{ isMobile: !!isMobile }} />;
  }

  renderPDP() {
    const { nbHits, isLoading } = this.props;
    if (!isLoading && nbHits === 1) {
      return (
        <div block="PDP" onClick={this.onPDPPageClicked}>
          {this.renderMySignInPopup()}
          {this.renderMainSection()}
          {this.renderSeperator()}
          {this.renderMixAndMatchSection()}
          {this.renderDetailsSection()}
          {this.renderDetail()}
        </div>
      );
    } else if (!isLoading && nbHits < 1) {
      return <NoMatch />;
    }

    return <Loader isLoading={isLoading} />;
  }

  render() {
    return this.renderPDP();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDP);
