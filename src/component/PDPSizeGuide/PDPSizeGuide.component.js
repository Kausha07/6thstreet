import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ExpandableContent from 'Component/ExpandableContent';
import SizeTable from 'Component/SizeTable';
import Popup from 'SourceComponent/Popup';
import isMobile from 'SourceUtil/Mobile/isMobile';
import { isArabic } from 'Util/App';

import './PDPSizeGuide.style';

class PDPSizeGuide extends PureComponent {
    static propTypes = {
        activeOverlay: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic(),
        isOpen: false
    };

    static getDerivedStateFromProps(nextProps) {
        const { activeOverlay } = nextProps;
        return ({ isOpen: activeOverlay === 'PDPSizeGuide' });
    }

    handleModalClick = () => {
        const { isOpen } = this.state;
        const { showOverlay } = this.props;
        showOverlay('PDPSizeGuide');
        this.setState({ isOpen: !isOpen });
    };

    renderButton() {
        return (
            <span
              onClick={ this.handleModalClick }
              onKeyDown={ this.handleModalClick }
              role="button"
              aria-label="Dismiss"
              tabIndex={ 0 }
              mix={ { block: 'PDPSizeGuide', elem: 'Button' } }
            >
                { isMobile.any() ? __('View Size Guide') : __('Size guide') }
            </span>
        );
    }

    renderModal() {
        const { isArabic, isOpen } = this.state;

        return (
            <Popup
              mix={ { block: 'PDPSizeGuide', elem: 'Modal', mods: { isOpen, isArabic } } }
              id="PDPSizeGuide"
              title="Sizing"
            >
                { this.renderModalContents() }
            </Popup>
        );
    }

    hideOverlay = () => {
        const { hideActiveOverlay } = this.props;
        hideActiveOverlay();
    };

    renderModalContents() {
        const { isArabic } = this.state;
        const closeBtn = (
            <div
              mix={ { block: 'PDPSizeGuide', elem: 'BackBtn', mods: { isArabic } } }
              onClick={ this.hideOverlay }
              onKeyDown={ this.hideOverlay }
              role="button"
              aria-label="Dismiss"
              tabIndex={ 0 }
            />
        );

        return (
            <div mix={ { block: 'PDPSizeGuide', elem: 'GuideContainer', mods: { isArabic } } }>
                <div mix={ { block: 'PDPSizeGuide', elem: 'HeaderContainer', mods: { isArabic } } }>
                    { isMobile.any() ? closeBtn : null }
                    <h1 mix={ { block: 'PDPSizeGuide', elem: 'Header', mods: { isArabic } } }>
                       { isMobile.any() ? __('SIZE GUIDE') : __('Sizing Guide') }
                    </h1>
                    <hr mix={ { block: 'PDPSizeGuide', elem: 'Line', mods: { isArabic } } } />
                </div>
                <span
                  mix={ { block: 'PDPSizeGuide', elem: 'SubHeader', mods: { isArabic } } }
                >
                    { __('Fitting Information - Items fits true to size') }
                </span>
                <div mix={ { block: 'PDPSizeGuide', elem: 'TableContainer', mods: { isArabic } } }>
                    { this.renderTableUK() }
                    <hr mix={ { block: 'PDPSizeGuide', elem: 'Divider', mods: { isArabic } } } />
                    { this.renderTableInt() }
                    <hr mix={ { block: 'PDPSizeGuide', elem: 'Divider', mods: { isArabic } } } />
                    { this.renderTableEu() }
                </div>
            </div>
        );
    }

    renderTableUK() {
        const { isArabic } = this.state;
        const isOpen = true;
        return (
            <ExpandableContent isOpen={ isOpen } header={ __('UK') } isArabic={ isArabic }>
                <SizeTable />
            </ExpandableContent>
        );
    }

    renderTableInt() {
        const { isArabic } = this.state;
        const isOpen = true;
        return (
            <ExpandableContent isOpen={ isOpen } header={ __('International') } isArabic={ isArabic }>
                <SizeTable />
            </ExpandableContent>
        );
    }

    renderTableEu() {
        const { isArabic } = this.state;
        const isOpen = false;
        return (
            <ExpandableContent isOpen={ isOpen } header={ __('European') } isArabic={ isArabic }>
                <SizeTable />
            </ExpandableContent>
        );
    }

    render() {
        const { isOpen } = this.state;
        return (
            <div block="PDPSizeGuide">
                { this.renderButton() }
                { isOpen ? this.renderModal() : null }
            </div>
        );
    }
}

export default PDPSizeGuide;
