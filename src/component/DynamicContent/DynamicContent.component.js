// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import DynamicContentBanner from 'Component/DynamicContentBanner';
import DynamicContentGrid from 'Component/DynamicContentGrid';
import DynamicContentMainBanner from 'Component/DynamicContentMainBanner';
import DynamicContentProductSlider from 'Component/DynamicContentProductSlider';
import { DynamicContent as DynamicContentType } from 'Util/API/endpoint/StaticFiles/StaticFiles.type';
import Logger from 'Util/Logger';

import './DynamicContent.style';

class DynamicContent extends PureComponent {
    static propTypes = {
        content: DynamicContentType.isRequired
    };

    renderMap = {
        banner: DynamicContentBanner,
        mainBanner: DynamicContentMainBanner,
        grid: DynamicContentGrid,
        productSlider: DynamicContentProductSlider
    };

    renderBlock = (block, i) => {
        const { type, ...restProps } = block;
        const Component = this.renderMap[type];

        if (!Component) {
            // TODO: implement all types
            Logger.log(type, restProps);
            return null;
        }

        return (
            <Component
              { ...restProps }
              key={ i }
            />
        );
    };

    renderBlocks() {
        const { content } = this.props;
        return content.map(this.renderBlock);
    }

    render() {
        return (
            <div block="DynamicContent">
                { this.renderBlocks() }
            </div>
        );
    }
}

export default DynamicContent;
