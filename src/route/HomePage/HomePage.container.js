import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getStaticFile } from 'Util/API/endpoint/StaticFiles/StaticFiles.endpoint';
import Logger from 'Util/Logger';

import HomePage from './HomePage.component';
import { HOME_STATIC_FILE_KEY } from './HomePage.config';

export const mapStateToProps = (state) => ({
    gender: state.AppState.gender,
    locale: state.AppState.locale
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class HomePageContainer extends PureComponent {
    static propTypes = {
        gender: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        dynamicContent: [],
        isLoading: true
    };

    constructor(props) {
        super(props);

        this.requestDynamicContent();
    }

    componentDidUpdate(prevProps) {
        const { gender: prevGender, locale: prevLocale } = prevProps;
        const { gender, locale } = this.props;

        if (gender !== prevGender || locale !== prevLocale) {
            this.requestDynamicContent(true);
        }
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
