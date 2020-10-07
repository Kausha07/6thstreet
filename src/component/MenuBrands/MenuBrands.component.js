import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { CategorySliderItems } from 'Util/API/endpoint/Categories/Categories.type';

import './MenuBrands.scss';

class MenuBrands extends PureComponent {
    static propTypes = {
        items: CategorySliderItems.isRequired
    };

    renderItems() {
        const { items } = this.props;
        return items.map(this.renderItem);
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

    render() {
        return (
            <div block="MenuBrands">
                <div block="MenuBrands" elem="ContentWrapper">
                    <span
                      block="MenuBrands"
                      elem="Title"
                    >
                        { __('Shop By Brads') }
                    </span>
                    <div
                      mix={ {
                          block: 'MenuBrands',
                          elem: 'ContentWrapper-Content'
                      } }
                    >
                        { this.renderItems() }
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuBrands;
