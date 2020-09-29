import Popup from '@scandipwa/scandipwa/src/component/Popup';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ExpandableContent from 'Component/ExpandableContent';
import SizeTable from 'Component/SizeTable';

import './PDPSizeGuide.style';

class PDPSizeGuide extends PureComponent {
    static propTypes = {
        language: PropTypes.string.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            isOpen: false
        };
    }

    static getDerivedStateFromProps(nextProps) {
        const { language, activeOverlay } = nextProps;
        return ({ isArabic: language !== 'en', isOpen: activeOverlay === 'PDPSizeGuide' });
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
            >
                Size guide
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

    renderModalContents() {
        const { isArabic } = this.state;

        return (
            <div mix={ { block: 'PDPSizeGuide', elem: 'GuideContainer', mods: { isArabic } } }>
                <h1>Sizing Guide</h1>
                <span>Fitting Information - Items fits true to size</span>
                { this.renderTableUK() }
                <hr />
                { this.renderTableInt() }
                <hr />
                { this.renderTableEu() }
            </div>
        );
    }

    renderTableUK() {
        const isOpen = true;
        return (
            <ExpandableContent isOpen={ isOpen } header={ __('UK') }>
                <SizeTable />
            </ExpandableContent>
        );
    }

    renderTableInt() {
        const isOpen = true;
        return (
            <ExpandableContent isOpen={ isOpen } header={ __('International') }>
                <SizeTable />
            </ExpandableContent>
        );
    }

    renderTableEu() {
        const isOpen = false;
        return (
            <ExpandableContent isOpen={ isOpen } header={ __('European') }>
                <SizeTable />
            </ExpandableContent>
        );
    }

    render() {
        const { isOpen } = this.state;
        console.log(isOpen);
        return (
            <div block="PDPSizeGuide">
                { isOpen ? this.renderModal() : this.renderButton() }
            </div>
        );
    }
}

export default PDPSizeGuide;
