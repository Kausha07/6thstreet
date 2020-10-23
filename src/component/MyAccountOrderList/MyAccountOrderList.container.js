import { connect } from 'react-redux';

import {
    MyAccountReturnCreateListContainer as SourceComponent
} from 'Component/MyAccountReturnCreateList/MyAccountReturnCreateList.container';
import { showNotification } from 'Store/Notification/Notification.action';

import MyAccountOrderList from './MyAccountOrderList.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification('error', error))
});

export class MyAccountOrderListContainer extends SourceComponent {
    render() {
        return (
            <MyAccountOrderList
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderListContainer);
