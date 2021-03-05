// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { PRODUCT_SLIDER_TYPE } from 'Component/DynamicContent/DynamicContent.config';
import DynamicContentBanner from 'Component/DynamicContentBanner';
import DynamicContentCircleItemSlider from 'Component/DynamicContentCircleItemSlider';
import DynamicContentFullWidthBannerSlider from 'Component/DynamicContentFullWidthBannerSlider';
import DynamicContentGrid from 'Component/DynamicContentGrid';
import DynamicContentMainBanner from 'Component/DynamicContentMainBanner';
import DynamicContentProductSlider from 'Component/DynamicContentProductSlider';
import DynamicContentSliderWithLabel from 'Component/DynamicContentSliderWithLabel';
import { DynamicContent as DynamicContentType } from 'Util/API/endpoint/StaticFiles/StaticFiles.type';
import Event, { EVENT_GTM_IMPRESSIONS_HOME } from 'Util/Event';
import Logger from 'Util/Logger';

import './DynamicContent.style';

class DynamicContent extends PureComponent {
    static propTypes = {
        content: DynamicContentType.isRequired
    };

    state = {
        impressions: [],
        sliderImpressionCount: 0
    };

    renderMap = {
        banner: DynamicContentBanner,
        mainBanner: DynamicContentMainBanner,
        grid: DynamicContentGrid,
        productSlider: DynamicContentProductSlider,
        fullWidthBannerSlider: DynamicContentFullWidthBannerSlider,
        circleItemSlider: DynamicContentCircleItemSlider,
        bannerSliderWithLabel: DynamicContentSliderWithLabel,
        line_separator: 'hr'

    };

    renderBlock = (block, i) => {
        const { type, ...restProps } = block;
        const Component = this.renderMap[type];
        if (!Component) {
            // TODO: implement all types
            Logger.log(type, restProps);
            return null;
        }

        // Gather product impressions from all page for gtm
        if (type === PRODUCT_SLIDER_TYPE) {
            restProps.setImpressions = (additionalImpressions = []) => {
                this.setState(({ impressions = [], sliderImpressionCount }) => ({
                    impressions: [...impressions, ...additionalImpressions],
                    sliderImpressionCount: sliderImpressionCount + 1
                }));
            };
        }

        return (
            <Component
              { ...restProps }
              key={ i }
            />
        );
    };

    renderBlocks() {
        const { content = [] } = this.props;
        console.log('xyz:', this.props)
        return content.map(this.renderBlock);
    }

    sendImpressions() {
        const { impressions, sliderImpressionCount } = this.state;
        const { content } = this.props;
        const sliderCount = content.filter(({ type }) => PRODUCT_SLIDER_TYPE === type).length;

        if (impressions.length && sliderImpressionCount === sliderCount) {
            Event.dispatch(EVENT_GTM_IMPRESSIONS_HOME, { impressions });
            this.setState({ impressions: [] });
        }
    }

    render() {
        return (
            <div block="DynamicContent">
                { this.renderBlocks() }
                { this.sendImpressions() }
            </div>
        );
    }
}

export default DynamicContent;
