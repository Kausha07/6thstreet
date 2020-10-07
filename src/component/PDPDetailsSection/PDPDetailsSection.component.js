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
                    { __('100% Genuine') }
                </div>
                <div block="PDPDetailsSection" elem="IconContainer">
                    <div block="PDPDetailsSection" elem="Icon" mods={ { freeReturn: true } } />
                    { __('Free Returns') }
                </div>
            </div>
        );
    }

    renderDescription() {
        const { product: { description } } = this.props;

        return <p block="PDPDetailsSection" elem="Description">{ description }</p>;
    }

    listTitle(str) {
        return str.replace('_', ' ');
    }

    renderListItem(arr) {
        return (
            <li block="PDPDetailsSection" elem="HighlightsList" key={ arr[0] }>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                    { this.listTitle(arr[0]) }
                </span>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ arr[1] }</span>
            </li>
        );
    }

    renderListItems(obj) {
        return Object.entries(obj).filter((item) => item[1] != null)
            .map((item) => this.renderListItem(item));
    }

    renderHighlights() {
        const {
            product: {
                material,
                dress_length,
                heel_height,
                heel_shape,
                leg_length,
                neck_line,
                skirt_length,
                toe_shape,
                sleeve_length
            }
        } = this.props;

        const { isHidden } = this.state;

        // got this info from API at this moment, should be changed when new DATA will be implemented.

        const productInfo = {
            material,
            dress_length,
            heel_height,
            heel_shape,
            leg_length,
            neck_line,
            skirt_length,
            toe_shape,
            sleeve_length
        };

        return (
            <div block="PDPDetailsSection" elem="Highlights">
                <ul>{ this.renderListItems(productInfo) }</ul>
                <button
                  block="PDPDetailsSection"
                  elem="MoreDetailsBtn"
                  mods={ { isHidden } }
                  mix={ { block: 'button secondary' } }
                  onClick={ this.openFullInfo }
                >
                    { __('view more details') }
                </button>
            </div>
        );
    }

    renderMoreDetailsItem(item) {
        return (
            <li block="PDPDetailsSection" elem="MoreDetailsList" key={ item.key }>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                    { item.key.toUpperCase() }
                </span>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ item.value }</span>
            </li>
        );
    }

    renderMoreDetailsList() {
        const { product, product: { highlighted_attributes } } = this.props;
        console.log(product);

        if (highlighted_attributes !== undefined && highlighted_attributes !== null) {
            return (
                <ul block="PDPDetailsSection" elem="MoreDetailsUl">
                    { highlighted_attributes.map((item) => this.renderMoreDetailsItem(item)) }
                </ul>
            );
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
