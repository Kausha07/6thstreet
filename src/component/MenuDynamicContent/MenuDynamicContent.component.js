// import PropTypes from 'prop-types';

import DynamicContent from 'Component/DynamicContent';
import MenuBanner from 'Component/MenuBanner';
import MenuGrid from 'Component/MenuGrid';

import './MenuDynamicContent.style';

class MenuDynamicContent extends DynamicContent {
    renderMap = {
        banner: MenuBanner,
        grid: MenuGrid
    };
}

export default MenuDynamicContent;
