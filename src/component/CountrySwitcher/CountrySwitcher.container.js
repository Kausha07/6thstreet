import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCountry } from 'Store/AppState/AppState.action';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { getCountriesForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import CountrySwitcher, { STORE_POPUP_ID } from './CountrySwitcher.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value)),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class CountrySwitcherContainer extends PureComponent {
    static propTypes = {
        setCountry: PropTypes.func.isRequired,
        config: Config.isRequired,
        country: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired
    };

    containerFunctions = {
        onCountrySelect: this.onCountrySelect.bind(this)
        // onClickSwitcher: this.onClickSwitcher.bind(this)
    };

    componentDidMount() {
        const { showOverlay } = this.props;

        showOverlay(STORE_POPUP_ID);
    }

    // onClickSwitcher() {
    //     console.log('hey');
    // }

    onCountrySelect(value) {
        const { setCountry } = this.props;
        setCountry(value);
    }

    containerProps = () => {
        const { country, config, showOverlay } = this.props;

        return {
            countrySelectOptions: getCountriesForSelect(config),
            country,
            showOverlay
        };
    };

    render() {
        return (
            <CountrySwitcher
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountrySwitcherContainer);
