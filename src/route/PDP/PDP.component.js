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
  }
  renderMainSection() {
    return <PDPMainSection renderMySignInPopup={this.renderMySignInPopup} />;
  }

  renderDetailsSection() {
    return <PDPDetailsSection {...this.props} />;
  }

  renderMixAndMatchSection() {
    return <PDPMixAndMatch />;
  }

  renderDetail() {
    return <PDPDetail {...this.props} />;
  }

  renderPDP() {
    const { nbHits, isLoading, } = this.props;
    const {signInPopUp} = this.state
    if (!isLoading) {
      return nbHits === 1 ? (
        <div block="PDP">
          {signInPopUp}
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
