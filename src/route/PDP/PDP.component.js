/* eslint-disable fp/no-let */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPDetailsSection from 'Component/PDPDetailsSection';
import PDPMainSection from 'Component/PDPMainSection';
import NoMatch from 'Route/NoMatch';

import './PDP.style';

class PDP extends PureComponent {
    static propTypes = {
        nbHits: PropTypes.number.isRequired
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

    renderPDP() {
        const { nbHits } = this.props;

        return nbHits === 1 ? (
            <div block="PDP">
                { this.renderMainSection() }
                { this.renderDetailsSection() }
            </div>
        ) : <NoMatch />;
    }

    render() {
        return this.renderPDP();
    }
}

export default PDP;
