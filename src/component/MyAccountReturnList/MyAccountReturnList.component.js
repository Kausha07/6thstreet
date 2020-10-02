import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import MyAccountReturnListItem from 'Component/MyAccountReturnListItem';

import './MyAccountReturnList.style';

class MyAccountReturnList extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        returns: PropTypes.array.isRequired
    };

    renderReturn(returnItem) {
        const { return_id } = returnItem;

        return (
            <MyAccountReturnListItem
              return={ returnItem }
              key={ return_id }
            />
        );
    }

    renderNoReturns() {
        return (
            <p>{ __('No returns') }</p>
        );
    }

    renderReturns() {
        const {
            returns,
            isLoading
        } = this.props;

        if (!returns.length && !isLoading) {
            return this.renderNoReturns();
        }

        return returns.map(this.renderReturn);
    }

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    render() {
        return (
            <div block="MyAccountOrderList">
                { this.renderReturns() }
                { this.renderLoader() }
            </div>
        );
    }
}

export default MyAccountReturnList;
