/* eslint-disable fp/no-let */
/* eslint-disable max-len */
import PropTypes from "prop-types";
import { PureComponent } from "react";

import PDPDetailsSection from "Component/PDPDetailsSection";
import PDPMainSection from "Component/PDPMainSection";
import PDPDetail from "Component/PDPDetail";
import PDPMixAndMatch from 'Component/PDPMixAndMatch';
import NoMatch from "Route/NoMatch";

import "./PDP.style";

class PDP extends PureComponent {
  static propTypes = {
    nbHits: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  renderMainSection() {
    return <PDPMainSection />;
  }

  renderDetailsSection() {
    return <PDPDetailsSection />;
  }

  renderMixAndMatchSection() {
    return <PDPMixAndMatch />;
  }

  renderDetail() {
    return <PDPDetail {...this.props} />;
  }
  

  renderPDP() {
    const { nbHits, isLoading } = this.props;

    if (!isLoading) {
      return nbHits === 1 ? (
        <div block="PDP">
          {this.renderMainSection()}
          { this.renderMixAndMatchSection() }
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
