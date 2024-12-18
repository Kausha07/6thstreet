import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { updateMeta } from 'Store/Meta/Meta.action';

import SomethingWentWrong from './SomethingWentWrong.component';

export const mapDispatchToProps = (dispatch) => ({
    updateMeta: (meta) => dispatch(updateMeta(meta))
});

export class SomethingWentWrongContainer extends PureComponent {
    static propTypes = {
        updateMeta: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('Something went wrong!') });
    }

    render() {
        return (
            <SomethingWentWrong
              { ...this.props }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(SomethingWentWrongContainer);
