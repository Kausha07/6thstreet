import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getStaticFile } from 'Util/API/endpoint/StaticFiles/StaticFiles.endpoint';
import Logger from 'Util/Logger';

import Menu from './Menu.component';
import { CATEGORIES_STATIC_FILE_KEY } from './Menu.config';

export const mapStateToProps = (state) => ({
    gender: state.AppState.gender,
    locale: state.AppState.locale
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class MenuContainer extends PureComponent {
    static propTypes = {
        gender: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired
    };

    state = {
        categories: [],
        isLoading: true
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        this.requestCategories();
    }

    componentDidUpdate(prevProps) {
        const { gender: prevGender, locale: prevLocale } = prevProps;
        const { gender, locale } = this.props;

        if (gender !== prevGender || locale !== prevLocale) {
            this.requestCategories(true);
        }
    }

    async requestCategories(isUpdate = false) {
        if (isUpdate) {
            // Only set loading if this is an update
            this.setState({ isLoading: true });
        }

        try {
            const categories = await getStaticFile(CATEGORIES_STATIC_FILE_KEY);

            this.setState({
                categories,
                isLoading: false
            });
        } catch (e) {
            // TODO: handle error
            Logger.log(e);
        }
    }

    containerProps = () => {
        const {
            isLoading,
            categories
        } = this.state;

        return {
            isLoading,
            categories
        };
    };

    render() {
        return (
            <Menu
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
