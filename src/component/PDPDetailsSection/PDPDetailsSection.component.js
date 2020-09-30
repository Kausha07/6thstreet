// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import './PDPDetailsSection.style';

class PDPDetailsSection extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

    state = {
        isHidden: true
    };

    openFullInfo = () => {
        this.setState({ isHidden: false });
    };

    renderIconsSection() {
        return (
            <div block="PDPDetailsSection" elem="IconsSection">
                <div block="PDPDetailsSection" elem="IconContainer">
                    <div block="PDPDetailsSection" elem="Icon" mods={ { isGenuine: true } } />
                    100% Genuine
                </div>
                <div block="PDPDetailsSection" elem="IconContainer">
                    <div block="PDPDetailsSection" elem="Icon" mods={ { freeReturn: true } } />
                    Free Returns
                </div>
            </div>
        );
    }

    renderDescription() {
        const { product: { description } } = this.props;

        return <p block="PDPDetailsSection" elem="Description">{ description }</p>;
    }

    listTitle(str) {
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

        return capitalized.replace('_', ' ');
    }

    renderHighlights() {
        const {
            product: {
                material,
                dress_length,
                heel_height,
                leg_length,
                neck_line,
                skirt_length,
                toe_shape
            }
        } = this.props;

        const { isHidden } = this.state;

        // got this info from API at this moment, should be changed when new DATA will be implemented.

        const productInfo = {
            material,
            dress_length,
            heel_height,
            leg_length,
            neck_line,
            skirt_length,
            toe_shape
        };

        const list = Object.entries(productInfo).filter((item) => item[1] != null)
            .map((item) => (
                <li block="PDPDetailsSection" elem="HighlightsList" key={ item[0] }>
                    <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                        { this.listTitle(item[0]) }
                    </span>
                    <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ item[1] }</span>
                </li>
            ));

        return (
            <div block="PDPDetailsSection" elem="Highlights">
                <ul>{ list }</ul>
                <button
                  block="PDPDetailsSection"
                  elem="MoreDetailsBtn"
                  mods={ { isHidden } }
                  mix={ { block: 'button secondary' } }
                  onClick={ this.openFullInfo }
                >
                    view more details
                </button>
            </div>
        );
    }

    renderMoreDetailsList() {
        const { product: { highlighted_attributes } } = this.props;

        if (highlighted_attributes !== undefined) {
            const list = highlighted_attributes.map((item) => (
                <li block="PDPDetailsSection" elem="MoreDetailsList" key={ item.key }>
                    <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                        { item.key.toUpperCase() }
                    </span>
                    <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ item.value }</span>
                </li>
            ));

            return <ul block="PDPDetailsSection" elem="MoreDetailsUl">{ list }</ul>;
        }

        return null;
    }

    renderMoreDetailsSection() {
        const { isHidden } = this.state;

        return (
            <div block="PDPDetailsSection" elem="MoreDetails" mods={ { isHidden } }>
                { this.renderMoreDetailsList() }
            </div>
        );
    }

    render() {
        return (
            <div block="PDPDetailsSection">
                <h2>Product details:</h2>
                { this.renderIconsSection() }
                { this.renderDescription() }
                { this.renderHighlights() }
                { this.renderMoreDetailsSection() }
            </div>
        );
    }
}

export default PDPDetailsSection;
