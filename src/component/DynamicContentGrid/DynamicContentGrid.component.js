import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Slider from 'Component/Slider';

import './DynamicContentGrid.style';

class DynamicContentGrid extends PureComponent {
    static propTypes = {
        // TODO: implement background color ?
        // background_color: PropTypes.string,
        // TODO: use height and width to calculate height, so nothing jumps
        // item_height: PropTypes.number.isRequired,
        items_per_row: PropTypes.number.isRequired,
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
            <Link to={ link } key={ i }>
                <Image src={ url } />
            </Link>
        );
    }

    renderItems() {
        const { items } = this.props;
        return items.map(this.renderItem);
    }

    renderGrid() {
        const { items_per_row } = this.props;

        return (
            <div
              block="DynamicContentGrid"
              elem="Grid"
              style={ { '--dynamic-content-grid-column-count': items_per_row } }
            >
            <Slider>
                { this.renderItems() }
            </Slider>
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
