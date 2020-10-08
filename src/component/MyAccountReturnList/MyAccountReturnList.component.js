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

    renderHeading() {
        return (
            <div block="MyAccountReturnList" elem="Header">
                <h2 block="MyAccountReturnList" elem="Heading">{ __('Return statement') }</h2>
                <button block="MyAccountReturnList" elem="Button">
                    { __('Return an item') }
                </button>
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountReturnList">
                { this.renderHeading() }
                { this.renderReturns() }
                { this.renderLoader() }
            </div>
        );
    }
}

export default MyAccountReturnList;
