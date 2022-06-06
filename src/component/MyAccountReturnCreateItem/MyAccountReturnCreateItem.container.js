import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { ReturnResolutionType } from 'Type/API';

import MyAccountReturnCreateItem from './MyAccountReturnCreateItem.component';

export const mapStateToProps = (state) => ({
    country: state.AppState.country
});

export const mapDispatchToProps = () => ({});

export class MyAccountReturnCreateItemContainer extends PureComponent {
    static propTypes = {
        item: PropTypes.shape({
            reason_options: PropTypes.array,
            item_id: PropTypes.string,
            is_returnable: PropTypes.bool.isRequired
        }).isRequired,
        onClick: PropTypes.func.isRequired,
        onResolutionChange: PropTypes.func.isRequired,
        onReasonChange: PropTypes.func.isRequired,
        resolutions: PropTypes.arrayOf(ReturnResolutionType),
        country: PropTypes.string.isRequired
    };

    static defaultProps = {
        resolutions: []
    };

    state = {
        isSelected: false
    };

    containerFunctions = {
        onClick: this.onClick.bind(this),
        onReasonChange: this.onReasonChange.bind(this),
        onResolutionChange: this.onResolutionChange.bind(this)
    };

    onReasonChange(value) {
        const { onReasonChange, item: { item_id } } = this.props;

        onReasonChange(item_id, value);
    }

    onResolutionChange(value) {
        const { onResolutionChange, item: { item_id } } = this.props;

        onResolutionChange(item_id, value);
    }

    onClick() {
        const { onClick, item: { item_id } } = this.props;

        this.setState(({ isSelected: prevIsSelected }) => {
            const isSelected = !prevIsSelected;
            onClick(item_id, isSelected);
            return { isSelected };
        });
    }

    containerProps = () => {
        const { item, country } = this.props;
        const { isSelected } = this.state;

        return {
            item,
            isSelected,
            resolutions: this.getResolutionOptions(),
            reasonOptions: this.getReasonOptions()
        };
    };

    getResolutionOptions() {
        const { resolutions = [] } = this.props;

        return resolutions.map(({ id, label }) => ({
            id,
            label,
            value: id +1 
        }));
    }

    getReasonOptions() {
        const { item: { reason_options = [] } } = this.props;

        return reason_options.map(({ id, label }) => {
            const value = id.toString();
            return {
                id: value,
                label,
                value
            };
        });
    }

    render() {
        return (
            <MyAccountReturnCreateItem
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnCreateItemContainer);
