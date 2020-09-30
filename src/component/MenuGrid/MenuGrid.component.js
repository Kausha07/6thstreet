import { PureComponent } from 'react';

import Link from 'Component/Link';
import { CategoryButton, CategoryItems } from 'Util/API/endpoint/Categories/Categories.type';

import './MenuGrid.style';

class MenuGrid extends PureComponent {
    static propTypes = {
        button: CategoryButton,
        items: CategoryItems.isRequired
    };

    static defaultProps = {
        button: {}
    };

    constructor() {
        super();
        this.state = {
            isArabic: false
        };
    }

    static getDerivedStateFromProps() {
        return ({
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        });
    }

    renderItem = (item, i) => {
        const {
            label,
            link
        } = item;

        return (
            <Link to={ link } key={ i }>
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
            <Link to={ linkTo }>
                { label }
            </Link>
        );
    }

    render() {
        const { isArabic } = this.state;

        return (
            <div block="MenuGrid">
                <div mix={ { block: 'MenuGrid', elem: 'Content', mods: { isArabic } } }>
                    <div
                      block="MenuGrid"
                      elem="Columns"
                    >
                        <div
                          block="MenuGrid"
                          elem="Column"
                        >
                            <span>
                                Shop by product
                            </span>
                            <div
                              block="MenuGrid-Column"
                              elem="Content"
                            >
                                { this.renderButton() }
                                { this.renderItems() }
                            </div>
                        </div>
                        <div
                          block="MenuGrid"
                          elem="Column"
                        >
                            <span>
                                Shop by brand
                            </span>
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
