// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
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

    renderItem = (item) => {
        const {
            image_url,
            label,
            link
        } = item;

        return (
            <Link to={ link }>
                <Image src={ image_url } />
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
            plp_config: {} // TODO: implement based on plp_title
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
                { this.renderItems() }
                { this.renderButton() }
            </div>
        );
    }
}

export default MenuGrid;
