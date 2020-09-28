// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import './PDPDetailsSection.style';

class PDPDetailsSection extends PureComponent {
    static propTypes = {
        product: Product.isRequired
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

        const productInfo = {
            material,
            dress_length,
            heel_height,
            leg_length,
            neck_line,
            skirt_length,
            toe_shape
        };

        console.log(Object.entries(productInfo));

        const list = Object.entries(productInfo).filter((item) => item[1] != null)
            .map((item) => (
                <li block="PDPDetailsSection" elem="ListLi" key={ item[0] }>
                    <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                        { this.listTitle(item[0]) }
                    </span>
                    <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ item[1] }</span>
                </li>
            ));

        // console.log('list ', list);
        return (
            <div block="PDPDetailsSection" elem="Highlights">
                <ul>{ list }</ul>
            </div>
        );
    }

    render() {
        const { product } = this.props;

        console.log(product);
        return (
            <div block="PDPDetailsSection">
                <h2>Product details:</h2>
                { this.renderIconsSection() }
                { this.renderDescription() }
                { this.renderHighlights() }
            </div>
        );
    }
}

export default PDPDetailsSection;
