import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { HistoryType, LocationType } from 'Type/Common';
import { groupByName } from 'Util/API/endpoint/Brands/Brands.format';
import Algolia from 'Util/API/provider/Algolia';
import { getQueryParam, setQueryParams } from 'Util/Url';

import Brands from './Brands.component';
import { TYPES_ARRAY } from './Brands.config';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (message) => dispatch(showNotification('error', message)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.then(({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch));
    },
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state))
});

class BrandsContainer extends PureComponent {
    static propTypes = {
        history: HistoryType.isRequired,
        location: LocationType.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired
    };

    state = {
        brands: [],
        isLoading: true
    };

    containerFunctions = {
        changeBrandType: this.changeBrandType.bind(this)
    };

    componentDidMount() {
        const brandUrlParam = getQueryParam('type', location);
        const brandType = TYPES_ARRAY.includes(brandUrlParam) ? brandUrlParam : '';

        this.requestBrands(brandType);
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
                url: '',
                name: __('Brands')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    changeBrandType(brandUrlParam) {
        const { location, history } = this.props;
        const brandType = TYPES_ARRAY.includes(brandUrlParam) ? brandUrlParam : '';

        setQueryParams({ type: brandType }, location, history);
        this.requestBrands(brandType);
    }

    requestBrands(brandType = '') {
        const { showErrorNotification } = this.props;

        this.setState({ isLoading: true });

        this._brandRequest = new Algolia().getBrands(brandType).then((data) => {
            const groupedBrands = groupByName(data) || {};

            // This sort places numeric brands to the end of the list
            const sortedBrands = Object.entries(groupedBrands).sort(([letter1], [letter2]) => {
                if (letter1 === '0-9') {
                    return 1;
                }

                if (letter2 === '0-9') {
                    return -1;
                }

                return letter1 - letter2;
            });

            this.setState({
                brands: sortedBrands,
                isLoading: false
            });
        }).catch((error) => showErrorNotification(error));
    }

    containerProps = () => {
        const { brands, isLoading } = this.state;

        return {
            brands,
            isLoading,
            type: getQueryParam('type', location)
        };
    };

    render() {
        return (
            <Brands
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BrandsContainer));
