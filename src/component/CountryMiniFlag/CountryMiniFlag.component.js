/* eslint-disable quote-props */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CountryMiniFlag.style';

class CountryMiniFlag extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired
    };

    renderFlag() {
        const {
            label
        } = this.props;

        const flagValues = {
            'AE': '0px',
            'SA': '-13px',
            'QA': '-27px',
            'OM': '-41px',
            'BH': '-55px',
            'KW': '-70px'
        };

        const left = label === 'SA' ? '-3px' : '-1px';
        const flagValue = `${left} ${ flagValues[label]}`;

        return (
        <div
          block="CountryMiniFlag"
          elem="Container"
          style={ { backgroundPosition: flagValue } }
        >
            <span block="CountryMiniFlag" elem="top" />
            <span block="CountryMiniFlag" elem="bottom" />
        </div>
        );
    }

    render() {
        return this.renderFlag();
    }
}

export default CountryMiniFlag;
