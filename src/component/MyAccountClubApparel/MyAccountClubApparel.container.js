import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import ClubApparelDispatcher from 'Store/ClubApparel/ClubApparel.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';

import MyAccountClubApparel from './MyAccountClubApparel.component';

export const mapStateToProps = (_state) => ({
    customer: _state.MyAccountReducer.customer
});

export const mapDispatchToProps = (dispatch) => ({
    getMember: (id) => ClubApparelDispatcher.getMember(dispatch, id),
    linkAccount: (data) => ClubApparelDispatcher.linkAccount(dispatch, data),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export class MyAccountClubApparelContainer extends PureComponent {
    static propTypes = {
        getMember: PropTypes.func.isRequired,
        linkAccount: PropTypes.func.isRequired,
        customer: customerType,
        showNotification: PropTypes.func.isRequired
    };

    static defaultProps = {
        customer: null
    };

    containerFunctions = {
        linkAccount: this.linkAccount.bind(this)
    };

    state = {
        clubApparelMember: null
    };

    componentDidUpdate() {
        const { customer: { id } } = this.props;
        const { clubApparelMember } = this.state;

        if (id && !clubApparelMember) {
            this.getClubApparelMember(id);
        }
    }

    linkAccount(fields) {
        const { customer: { id }, linkAccount } = this.props;
        const { phone } = fields;

        linkAccount({ customerId: id, mobileNo: phone }).then(
            (response) => {
                if (response && response.data) {
                    this.setState({ clubApparelMember: response.data });
                }
            },
            this._handleError
        );
    }

    getClubApparelMember(id) {
        const { getMember } = this.props;

        getMember(id).then(
            (response) => {
                if (response && response.data) {
                    this.setState({ clubApparelMember: response.data });
                }
            },
            this._handleError
        );
    }

    render() {
        return (
            <MyAccountClubApparel
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountClubApparelContainer);
