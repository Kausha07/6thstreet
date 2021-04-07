import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { postFeedback } from 'Util/API/endpoint/Feedback/Feedback.endpoint';

import Feedback from './Feedback.component';

export const BreadcrumbsDispatcher = import(
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
});

export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export class FeedbackContainer extends PureComponent {

    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderState();
    }

    updateHeaderState() {
        const { changeHeaderState } = this.props;
  
        changeHeaderState({
            name: DEFAULT_STATE_NAME,
            isHiddenOnMobile: true
        });
    }
  
    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '/feedback',
                name: __('Feedback')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];
  
        updateBreadcrumbs(breadcrumbs);
    }

    async onSubmit(data) {
        const {
            firstname,
            lastname,
            email,
            phoneNumber: telephone,
            comment
        } = data;

        const { showNotification } = this.props;

        try {
            const response = await postFeedback({
                'contactForm[name]': `${firstname} ${lastname}`,
                'contactForm[email]': email,
                'contactForm[telephone]': telephone,
                'contactForm[comment]': comment
            });
            if(response){
                showNotification(
                    response.type?'success':'error',
                    response.message
                );
            }
        }
        catch(err){
            console.error(err);
        }
    }

    render() {
        return (
            <Feedback
                onSubmit={this.onSubmit.bind(this)}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
