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
        ).isRequired,
        header: PropTypes.shape({
            title: PropTypes.string
        }),
        items_per_row: PropTypes.number
    };

    static defaultProps = {
        items_per_row: 4,
        header: {}
    };

    renderItem(item, i) {
        const { link, url } = item;

        return (
            <div block="CategoryItem" elem="Content" key={ i }>
                <Link to={ link } key={ i }>
                    <Image src={ url } ratio="custom" height="auto" />
                </Link>
            </div>
        );
    }

    renderItems() {
        const { items = [] } = this.props;
        return items.map(this.renderItem);
    }

    renderGrid() {
        const { items_per_row, header: { title } = {} } = this.props;

        return (
            <>
                <h4>{ title }</h4>
                <div
                  block="DynamicContentGrid"
                  elem="Grid"
                  mods={ { items_per_row } }
                >
                    { this.renderItems() }
                </div>
            </>
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
