import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setGender } from 'Store/AppState/AppState.action';
import MenuDispatcher from 'Store/Menu/Menu.dispatcher';
import { isMsiteMegaMenuRoute } from "Component/MobileMegaMenu/Utils/MobileMegaMenu.helper";

import Menu from './Menu.component';

export const mapStateToProps = (state) => ({
    gender: state.AppState.gender,
    locale: state.AppState.locale,
    categories: state.MenuReducer.categories,
    is_msite_megamenu_enabled: state.AppConfig.is_msite_megamenu_enabled,
});

export const mapDispatchToProps = (dispatch) => ({
    setGender: (gender) => dispatch(setGender(gender)),
    requestCategories: (gender) => MenuDispatcher.requestCategories(gender, dispatch),
});

export class MenuContainer extends PureComponent {
    static propTypes = {
        gender: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired,
        newMenuGender: PropTypes.string.isRequired,
        setGender: PropTypes.func.isRequired,
        requestCategories: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired,
        is_msite_megamenu_enabled: PropTypes.bool,
    };

    state = {
        isLoading: true,
        menuGender: 'women'
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const { menuGender } = this.state;
        this.requestCategories(true, menuGender);
    }

    componentDidUpdate(prevProps) {
        const { gender: prevGender, locale: prevLocale } = prevProps;
        const { gender, locale, newMenuGender } = this.props;
        const { menuGender } = this.state;
        if (newMenuGender !== menuGender && newMenuGender !== '') {
            this.changeMenuGender();
        }

        if (gender !== prevGender || locale !== prevLocale) {
            this.requestCategories(true);
        }
    }

    changeMenuGender = () => {
        const { newMenuGender } = this.props;
        this.setState({ menuGender: newMenuGender });
    };

    requestCategories() {
        const { requestCategories, gender } = this.props;

        // ignore menu request if there is no gender passed
        if (!gender) {
            return;
        }    
        if(!isMsiteMegaMenuRoute()) {
            requestCategories(gender);
        }
    }

    containerProps = () => {
        const {
            isLoading
        } = this.state;

        const {
            gender,
            setGender,
            categories,
            is_msite_megamenu_enabled,
        } = this.props;

        return {
            isLoading,
            categories,
            gender,
            setGender,
            is_msite_megamenu_enabled,
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
