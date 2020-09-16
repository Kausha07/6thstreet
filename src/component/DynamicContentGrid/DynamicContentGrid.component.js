import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';

import './DynamicContentGrid.style';

class DynamicContentGrid extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                link: PropTypes.string,
                url: PropTypes.string
            })
        ).isRequired
    };

    renderItem(item, i) {
        const { link, url } = item;

        return (
            <div block="CategoryItem" elem="Content">
                <Link to={ link } key={ i }>
                    <Image src={ url } />
                </Link>
                <div block="CategoryItem" elem="Text">
                    <span
                      block="CategoryItem"
                      elem="Title"
                    >
                        { __('category title') }
                    </span>
                    <span
                      block="CategoryItem"
                      elem="SubTitle"
                    >
                        { __('category subtitle') }
                    </span>
                </div>
                <Link to={ link } key={ i }>
                    <button
                      block="button secondary medium"
                    >
                        { __('shop now') }
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
