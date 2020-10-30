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
        locale: PropTypes.string.isRequired,
        newMenuGender: PropTypes.string.isRequired
    };

    state = {
        categories: [],
        isLoading: true,
        menuGender: ''
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        this.requestCategories();
    }

    componentDidMount() {
        const { gender } = this.props;
        this.setState({ menuGender: gender });
    }

    componentDidUpdate(prevProps) {
        const { gender: prevGender, locale: prevLocale } = prevProps;
        const { gender, locale, newMenuGender } = this.props;
        const { menuGender } = this.state;

        if (newMenuGender !== menuGender) {
            this.changeMenuGender();
            this.requestCategories(true, newMenuGender);
        }

        if (gender !== prevGender || locale !== prevLocale) {
            this.requestCategories(true);
        }
    }

    changeMenuGender = () => {
        const { newMenuGender } = this.props;
        this.setState({ menuGender: newMenuGender });
    };

    async requestCategories(isUpdate = false, gender = this.props) {
        if (isUpdate) {
            // Only set loading if this is an update
            this.setState({ isLoading: true });
        }

        try {
            if (typeof gender === 'object') {
                this.setState({
                    categories: await getStaticFile(CATEGORIES_STATIC_FILE_KEY, { $GENDER: gender.gender }),
                    isLoading: false
                });
            } else {
                this.setState({
                    categories: await getStaticFile(CATEGORIES_STATIC_FILE_KEY, { $GENDER: gender }),
                    isLoading: false
                });
            }
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
