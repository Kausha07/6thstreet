// import PropTypes from 'prop-types';

import DynamicContent from 'Component/DynamicContent';
import MenuBanner from 'Component/MenuBanner';
import MenuBrands from 'Component/MenuBrands';
import MenuGrid from 'Component/MenuGrid';

import './MenuDynamicContent.style';

class MenuDynamicContent extends DynamicContent {
    renderMap = {
        banner: MenuBanner,
        grid: MenuGrid,
        slider: MenuBrands
    };
}

export default MenuDynamicContent;
