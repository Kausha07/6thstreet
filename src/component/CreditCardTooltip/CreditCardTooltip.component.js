/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Html from 'Component/Html';
import Image from 'Component/Image';
import { isArabic } from 'Util/App';

import './CreditCardTooltip.style';

class CreditCardTooltip extends PureComponent {
    static propTypes = {
        collapsedPromoMessage: PropTypes.isRequired,
        expandedPromoMessage: PropTypes.isRequired,
        bankLogos: PropTypes.array.isRequired
    };

    state = {
        isExpanded: false,
        isArabic: isArabic()
    };

    onDropdownClick = () => {
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
    };

    renderContent() {
        const { collapsedPromoMessage } = this.props;

        const message = collapsedPromoMessage.replace("href='expand'", '');

        return (
            <div
              block="CreditCardTooltip"
              elem="PromoBlock"
              onClick={ this.onDropdownClick }
            >
                <Html content={ message } />
            </div>
        );
    }

    getImageList() {
        const { bankLogos } = this.props;

        const logoList = bankLogos.map((bankLogo) => (
                <Image
                  key="bankLogo"
                  src={ bankLogo.value }
                  ratio="custom"
                  width="100px"
                  height="35px"
                />
        ));

        return logoList;
    }

    renderPopup() {
        const { expandedPromoMessage } = this.props;
        const { isExpanded, isArabic } = this.state;

        return (
            isExpanded && (
                <div block="CreditCardTooltip" elem="Background" onClick={ this.onDropdownClick }>
                    <div block="CreditCardTooltip" elem="Popup" mods={ { isArabic } }>
                        <Html content={ expandedPromoMessage } />
                        <div block="CreditCardTooltip" elem="Grid">{ this.getImageList() }</div>
                    </div>
                </div>
            )
        );
    }

    render() {
        return (
            <div block="CreditCardTooltip">
                { this.renderPopup() }
                { this.renderContent() }
            </div>
        );
    }
}

export default CreditCardTooltip;
