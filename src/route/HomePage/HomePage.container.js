import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setGender } from 'Store/AppState/AppState.action';
import { getStaticFile } from 'Util/API/endpoint/StaticFiles/StaticFiles.endpoint';
import Logger from 'Util/Logger';

import HomePage from './HomePage.component';
import { HOME_STATIC_FILE_KEY } from './HomePage.config';

export const mapStateToProps = (state) => ({
    gender: state.AppState.gender,
    locale: state.AppState.locale
});

export const mapDispatchToProps = (dispatch) => ({
    setGender: (gender) => dispatch(setGender(gender))
});

export class HomePageContainer extends PureComponent {
    static propTypes = {
        setGender: PropTypes.func.isRequired,
        gender: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired
    };

    state = {
        dynamicContent: [],
        isLoading: true,
        urlGender: '',
        defaultGender: 'men'
    };

    constructor(props) {
        super(props);

        this.requestDynamicContent();
    }

    componentDidMount() {
        this.setUrlGender();
        const { gender } = this.props;
        const { urlGender } = this.state;
        if (gender === '' && urlGender === '') {
            this.setDefaultGender();
        }
    }

    componentDidUpdate(prevProps) {
        this.setUrlGender();
        const { gender: prevGender, locale: prevLocale } = prevProps;
        const { locale, gender, setGender } = this.props;
        const { urlGender } = this.state;
        setGender(urlGender);

        if (gender !== prevGender || locale !== prevLocale) {
            this.requestDynamicContent(true, urlGender);
        }
    }

    setDefaultGender() {
        const { setGender } = this.props;
        const { defaultGender } = this.state;
        setGender(defaultGender);
        this.setState({ urlGender: defaultGender });
    }

    setUrlGender() {
        const urlWithoutSeparator = location.pathname.split('/');
        this.setState({ urlGender: urlWithoutSeparator[1].split('.')[0].toLowerCase() });
    }

    async requestDynamicContent(isUpdate = false) {
        const { gender } = this.props;

        if (isUpdate) {
            // Only set loading if this is an update
            this.setState({ isLoading: true });
        }

        try {
            const dynamicContent = await getStaticFile(
                HOME_STATIC_FILE_KEY,
                { $FILE_NAME: `${gender}.json` }
            );

            this.setState({
                dynamicContent,
                isLoading: false
            });
        } catch (e) {
            // TODO: handle error
            Logger.log(e);
        }
    }

    containerProps = () => {
        const {
            dynamicContent,
            isLoading
        } = this.state;

        return {
            dynamicContent,
            isLoading
        };
    };

    render() {
        return (
            <HomePage
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
