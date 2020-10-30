import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { hideActiveOverlay } from 'SourceStore/Overlay/Overlay.action';
import { CategoryButton, CategoryItems } from 'Util/API/endpoint/Categories/Categories.type';
import { isArabic } from 'Util/App';

import './MenuGrid.style';

class MenuGrid extends PureComponent {
    state = {
        isArabic: isArabic(),
        isAllShowing: true
    };

    static propTypes = {
        button: CategoryButton,
        items: CategoryItems.isRequired
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

        if (!link) {
            return null;
        }

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

    renderDesktopButton() {
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
            <Link to={ linkTo } onClick={ this.hideMenu }>
                { label }
            </Link>
        );
    }

    hideMenu = () => {
        hideActiveOverlay();
    };

    showAllCategories() {
        this.setState(({ isAllShowing }) => ({ isAllShowing: !isAllShowing }));
    }

    renderViewAllButton() {
        const {
            button: {
                link
            }
        } = this.props;

        const linkTo = {
            pathname: link,
            state: { plp_config: {} }
        };

        return (
            <button
              block="ViewAll"
              elem="Button"
            >
                <Link to={ linkTo } onClick={ this.hideMenu }>
                    <span>view all</span>
                </Link>
            </button>
        );
    }

    renderSubcategories() {
        const { isArabic } = this.state;

        return (
            <>
                <span
                  block="MenuGrid"
                  elem="Title"
                >
                    { __('Shop by product') }
                </span>
                { this.renderViewAllButton() }
                <div
                  mix={ {
                      block: 'MenuGrid-Column',
                      elem: 'Content',
                      mods: { isArabic }
                  } }
                >
                    { this.renderDesktopButton() }
                    { this.renderItems() }
                </div>
            </>
        );
    }

    render() {
        const { isArabic } = this.state;
        const { isAllShowing } = this.state;

        return (
            <div block="MenuGrid">
                <div
                  mix={ {
                      block: 'MenuGrid',
                      elem: 'Content',
                      mods: { isArabic }
                  } }
                >
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
                            { this.renderSubcategories() }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuGrid;
