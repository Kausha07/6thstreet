// import PropTypes from 'prop-types';
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
                // plp_title
            }
        } = this.props;

        const linkTo = {
            pathname: link,
            state: { plp_config: {} } // TODO: implement based on plp_title
        };

        return (
            <Link to={ linkTo }>
                { label }
            </Link>
        );
    }

    render() {
        return (
            <div block="MenuGrid">
                <div
                  block="MenuGrid"
                  elem="Content"
                >
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
