// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPDetailsSection from 'Component/PDPDetailsSection';
import PDPMainSection from 'Component/PDPMainSection';

import './PDP.style';

class PDP extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderMainSection() {
        return (
            <PDPMainSection />
        );
    }

    renderDetailsSection() {
        return (
            <PDPDetailsSection />
        );
    }

    render() {
        return (
            <div block="PDP">
                { this.renderMainSection() }
                { this.renderDetailsSection() }
            </div>
        );
    }
}

export default PDP;
