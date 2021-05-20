import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { updateMeta } from "Store/Meta/Meta.action";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { postFeedback } from 'Util/API/endpoint/Feedback/Feedback.endpoint';

import Logger from 'Util/Logger';
import Feedback from './Feedback.component';

export const BreadcrumbsDispatcher = import(
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    config: state.AppConfig.config,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    setMeta: (meta) => dispatch(updateMeta(meta)),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export class FeedbackContainer extends PureComponent {

    static propTypes = {
        config: PropTypes.object.isRequired,
        country: PropTypes.string.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        setMeta: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderState();
        this.setMetaData();
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

    setMetaData() {    

        const {
            config,
            country,
            setMeta,
        } = this.props;

        const countryList = getCountriesForSelect(config);
        const { label: countryName = "" } = countryList.find((obj) => obj.id === country) || {};
    
        setMeta({
          title: __("Feedback | 6thStreet.com %s", countryName),
          keywords: __(
            "Feedback, Contact Us, Suggestions Online Shopping, %s",
            countryName,
          ),
          description: __("Jot us a note and well get back to you as quickly as possible."),
        });
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
            Logger.error(err);
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
