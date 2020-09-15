import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';

import './DynamicContentGrid.style';

class DynamicContentGrid extends PureComponent {
    static propTypes = {
        // TODO: implement background color ?
        // background_color: PropTypes.string,
        // TODO: use height and width to calculate height, so nothing jumps
        // item_height: PropTypes.number.isRequired,
        /* items_per_row: PropTypes.number.isRequired, */
        items: PropTypes.arrayOf(
            PropTypes.shape({
                link: PropTypes.string,
                url: PropTypes.string
            })
        ).isRequired
    };

    // static defaultProps = {
    //     background_color: ''
    // };

    renderItem(item, i) {
        const { link, url } = item;

        return (
            <div block="CategoryItem">
                <Link to={ link } key={ i }>
                    <Image src={ url } />
                </Link>
                <div block="CategoryItem" elem="Text">
                    <span
                      block="CategoryItem"
                      elem="Text-Title"
                    >
                        { __('CATEGORY TITLE') }
                    </span>
                    <span
                      block="CategoryItem"
                      elem="Text-SubTitle"
                    >
                        { __('Category subtitle') }
                    </span>
                </div>
                <Link to={ link } key={ i }>
                    <button
                      block="button secondary medium"
                    >
                        { __('SHOP NOW') }
                    </button>
                </Link>
            </div>
        );
    }

    renderItems() {
        const { items } = this.props;
        return items.map(this.renderItem);
    }

    renderGrid() {
        const { items_per_row } = 3;

        return (
            <div
              block="DynamicContentGrid"
              elem="Grid"
              style={ { '--dynamic-content-grid-column-count': items_per_row } }
            >
                { this.renderItems() }
            </div>
        );
    }

    render() {
        return (
            <div block="DynamicContentGrid">
                { this.renderGrid() }
            </div>
        );
    }
}

export default DynamicContentGrid;
