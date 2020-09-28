import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Overlay from 'Component/Overlay';
import PLPFilter from 'Component/PLPFilter';

import { PLP_FILTER_OVERLAY_ID } from './PLPFilterOverlay.config';

import './PLPFilterOverlay.style';

export class PLPFilterOverlay extends PureComponent {
    static propTypes = {
        onSeeResultsClick: PropTypes.func.isRequired,
        onVisible: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired
    };

    renderFilters() {
        return (
            <PLPFilter
              mix={ { block: 'PLPFilterOverlay', elem: 'Attributes' } }
            />
        );
    }

    renderSeeResults() {
        const { onSeeResultsClick } = this.props;

        return (
            <div
              block="PLPFilterOverlay"
              elem="SeeResults"
            >
                <button
                  block="PLPFilterOverlay"
                  elem="Button"
                  mix={ { block: 'Button' } }
                  onClick={ onSeeResultsClick }
                >
                    { __('SEE RESULTS') }
                </button>
            </div>
        );
    }

    renderHeading() {
        return (
            <h2 block="PLPFilterOverlay" elem="Heading">
                { __('Filter') }
            </h2>
        );
    }

    renderNoResults() {
        return (
            <p block="PLPFilterOverlay" elem="NoResults">
                { __(`The selected filter combination returned no results.
                Please try again, using a different set of filters.`) }
            </p>
        );
    }

    renderEmptyFilters() {
        return (
            <>
                { this.renderNoResults() }
                { this.renderResetButton() }
                { this.renderSeeResults() }
            </>
        );
    }

    renderMinimalFilters() {
        return this.renderSeeResults();
    }

    renderDefaultFilters() {
        return (
            <>
                { this.renderHeading() }
                { this.renderFilters() }
                { this.renderSeeResults() }
            </>
        );
    }

    renderContent() {
        return this.renderDefaultFilters();
    }

    render() {
        const {
            onVisible,
            onHide
        } = this.props;

        return (
            <Overlay
              onVisible={ onVisible }
              onHide={ onHide }
              mix={ { block: 'PLPFilterOverlay' } }
              id={ PLP_FILTER_OVERLAY_ID }
              isRenderInPortal={ false }
            >
                <div>
                    { this.renderContent() }
                </div>
            </Overlay>
        );
    }
}

export default PLPFilterOverlay;
