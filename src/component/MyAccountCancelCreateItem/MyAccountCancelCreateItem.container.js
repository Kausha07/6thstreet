import { connect } from 'react-redux';

import {
    mapDispatchToProps,
    mapStateToProps,
    MyAccountReturnCreateItemContainer as SourceComponent
} from 'Component/MyAccountReturnCreateItem/MyAccountReturnCreateItem.container';

import MyAccountCancelCreateItem from './MyAccountCancelCreateItem.component';
import { DISPLAY_DISCOUNT_PERCENTAGE } from '../Price/Price.config';

export class MyAccountCancelCreateItemContainer extends SourceComponent {
    render() {
        const { country } = this.props;
        const displayDiscountPercentage = DISPLAY_DISCOUNT_PERCENTAGE[country];
        return (
            <MyAccountCancelCreateItem
              { ...this.containerFunctions }
              { ...this.containerProps() }
              displayDiscountPercentage= { displayDiscountPercentage }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCancelCreateItemContainer);
