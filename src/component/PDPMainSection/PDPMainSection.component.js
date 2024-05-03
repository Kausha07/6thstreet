// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPGallery from 'Component/PDPGallery';
import PDPSummary from 'Component/PDPSummary';

import './PDPMainSection.style';

const PDPPageJSON = {
    renderMySignInPopup:{},
    renderMainSection:{
      gallery:{},
      summary:{}
    },
    renderSeperator:{},
    renderMixAndMatchSection:{},
    renderDetailsSection:{},
    renderDetail:{}
  }

class PDPMainSection extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    }

    renderSummary(val) {
        return (
            <PDPSummary renderSummary={val} {...this.props} />
        );
    }

    renderGallery() {
        return <PDPGallery {...this.props}/>;
    }

    render() {
        const { renderMainSection } = this.props;
        return (
            <div block="PDPMainSection">
                { renderMainSection.map((data, index) => {
                    if(data.name === 'gallery'){
                        return this.renderGallery()
                    }
                    if(data.name === 'summary'){
                        return this.renderSummary(data.sectionData);
                    }
                })}
                {/* { this.renderGallery() }
                { this.renderSummary() } */}
            </div>
        );
    }
}

export default PDPMainSection;
