import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCountry } from 'Store/AppState/AppState.action';
import { getCountriesForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import StoreSwitcherPopup from './StoreSwitcherPopup.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value))
});

class StoreSwitcherPopupContainer extends PureComponent {
    static propTypes = {
        setCountry: PropTypes.func.isRequired,
        config: Config.isRequired,
        country: PropTypes.string.isRequired
    };

    containerFunctions = {
        onCountrySelect: this.onCountrySelect.bind(this)
    };

    onCountrySelect(value) {
        const { setCountry } = this.props;
        setCountry(value);
    }

    containerProps = () => {
        const { country, config } = this.props;

        return {
            countrySelectOptions: getCountriesForSelect(config),
            country
        };
    };

    render() {
        return (
            <StoreSwitcherPopup
              { ...this.containerFunctions }
              { ...this.containerProps() }
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreSwitcherPopupContainer);
