import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';
import { CategoryButton, CategoryItems } from 'Util/API/endpoint/Categories/Categories.type';
import { isArabic } from 'Util/App';

import './MenuGrid.style';

class MenuGrid extends PureComponent {
    state = {
        isArabic: isArabic(),
        isAllShowing: false
    };

    static propTypes = {
        button: CategoryButton,
        items: CategoryItems.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired
    };

    static defaultProps = {
        button: {}
    };

    constructor(props) {
        super(props);
        this.showAllCategories = this.showAllCategories.bind(this);
    }

    renderItem = (item, i) => {
        const {
            image_url,
            label,
            link
        } = item;

        return (
            <Link
              to={ link }
              key={ i }
            >
                <Image
                  src={ image_url }
                />
                { label }
            </Link>
        );
    };

    renderItems() {
        const { items } = this.props;
        return items.map(this.renderItem);
    }

    renderButton() {
        const {
            button: {
                label,
                link
            }
        } = this.props;

        const linkTo = {
            pathname: link,
            state: { plp_config: {} }
        };

        return (
            <div
              block="ViewAll"
              elem="Link"
            >
                <Link to={ linkTo } onClick={ this.hideMenu }>
                    { label }
                </Link>
            </div>
        );
    }

    hideMenu = () => {
        const { toggleOverlayByKey } = this.props;
        toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
    };

    showAllCategories() {
        this.setState(({ isAllShowing }) => ({ isAllShowing: !isAllShowing }));
    }

    // in case if Promo block will be added, use this function (styles already made)
    renderViewAllButton() {
        return (
            <button
              block="ViewAll"
              elem="Button"
              onClick={ this.showAllCategories }
            >
                view all
            </button>
        );
    }

    render() {
        const { isArabic } = this.state;
        const { isAllShowing } = this.state;

        return (
            <div block="MenuGrid">
                <div mix={ { block: 'MenuGrid', elem: 'Content', mods: { isArabic } } }>
                    <div
                      block="MenuGrid"
                      elem="Columns"
                    >
                        <div
                          mix={ {
                              block: 'MenuGrid',
                              elem: 'Column',
                              mods: { isAllShow: isAllShowing }
                          } }
                        >
                            <span
                              block="MenuGrid"
                              elem="Title"
                            >
                                { __('Shop by product') }
                            </span>
                            { this.renderButton() }
                            <div
                              block="MenuGrid-Column"
                              elem="Content"
                            >
                                { this.renderItems() }
                            </div>
                        </div>
                        <div
                          block="MenuGrid"
                          elem="Column"
                        >
                            <div
                              block="MenuGrid-Column"
                              elem="Content"
                            />
                        </div>
                        <div
                          block="MenuGrid"
                          elem="Column"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuGrid;
