// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Accordion from 'Component/Accordion';
import ShareButton from 'Component/ShareButton';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import { PDP_ARABIC_VALUES_TRANSLATIONS } from './PDPDetailsSection.config';
import './PDPDetailsSection.style';

class PDPDetailsSection extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

    state = {
        isHidden: true,
        isExpanded: {
            "0": true,
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true
        }
    };

    _translateValue(value) {
        if (typeof PDP_ARABIC_VALUES_TRANSLATIONS[value] === 'undefined') {
            return value;
        }

        return PDP_ARABIC_VALUES_TRANSLATIONS[value];
    }

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
        return (
            <>
                <p block="PDPDetailsSection" elem="Description">
                    { description }
                </p>
                { this.renderHighlights() }
            </>
        )
    }

    listTitle(str) {
        return str.replace('_', ' ');
    }

    renderListItem(arr) {
        return (
            <li block="PDPDetailsSection" elem="HighlightsList" key={ arr[0] }>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                    { isArabic() ? this._translateValue(arr[0]) : this.listTitle(arr[0]) }
                </span>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ arr[1] }</span>
            </li>
        );
    }

    renderListItems(obj = {}) {
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
                <h4>{ __('Highlights') }</h4>
                <ul>{ this.renderListItems(productInfo) }</ul>
                { this.renderMoreDetailsList() }
            </div>
        );
    }

    renderShareButton() {
        const url = new URL(window.location.href);
        return (
            <div block="PDPDetailsSection" elem="ShareButtonContainer">
                <ShareButton
                    block="PDPDetailsSection-ShareButtonContainer"
                    elem="ShareButton"
                    title = { document.title }
                    text =  {`Hey check this out: ${document.title}`}
                    url = { url.searchParams.append('utm_source', 'pdp_share') }
                >
                    <span>{ __('Share') }</span>
                </ShareButton>
            </div>
        );
    }

    renderSizeAndFit() {
        const { product: { description } } = this.props;
        return (
            <>
                <p block="PDPDetailsSection" elem="SizeFit">
                    {__('Fitting Information - Items fits true to size')}
                </p>
                <div block="PDPDetailsSection" elem="ModelMeasurements">
                    <h4>{ __('Model Measurements') }</h4>
                </div>
            </>
        )
    }

    renderMoreDetailsItem(item) {
        return (
            <li block="PDPDetailsSection" elem="MoreDetailsList" key={ item.key }>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'title' } }>
                    { isArabic() ? this._translateValue(item.key) : this.listTitle(__(item.key)) }
                </span>
                <span block="PDPDetailsSection" elem="ListItem" mods={ { mod: 'value' } }>{ item.value }</span>
            </li>
        );
    }

    renderMoreDetailsList() {
        const { product: { highlighted_attributes } } = this.props;

        if (highlighted_attributes !== undefined && highlighted_attributes !== null) {
            return (
                <ul block="PDPDetailsSection" elem="MoreDetailsUl">
                    { highlighted_attributes.filter(({ key }) => key !== 'alternate_name')
                        .map((item) => this.renderMoreDetailsItem(item)) }
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

    renderAccordionTitle(title) {
        return (
            <div block="'PDPDetailsSection-Description" elem="AccordionTitle">
                <h3>
                    { title }
                </h3>
            </div>
        );
    }

    render() {
        const { product: { brand_name }} = this.props
        return (
            <div block="PDPDetailsSection">
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Description') }
                  is_expanded={this.state.isExpanded["0"]}
                >
                    {this.renderIconsSection() }
                    { this.renderDescription() }
                    <div block="Seperator" />
                    { this.renderShareButton() }
                </Accordion>
                {/* <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Size & Fit') }
                  is_expanded={this.state.isExpanded["1"]}
                >
                    { this.renderSizeAndFit() }
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Click & Collect') }
                  is_expanded={this.state.isExpanded["2"]}
                >
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Shipping & Free Returns') }
                  is_expanded={this.state.isExpanded["3"]}
                >
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ `${__('About')} ${brand_name}` }
                  is_expanded={this.state.isExpanded["4"]}
                >
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Contact Us') }
                  is_expanded={this.state.isExpanded["5"]}
                >
                </Accordion> */}

            </div>
        );
    }
}

export default PDPDetailsSection;
