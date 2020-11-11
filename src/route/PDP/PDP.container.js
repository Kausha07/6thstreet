import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CATEGORIES_STATIC_FILE_KEY } from 'Component/Menu/Menu.config';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { setGender } from 'Store/AppState/AppState.action';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { setPDPLoading } from 'Store/PDP/PDP.action';
import PDPDispatcher from 'Store/PDP/PDP.dispatcher';
import { getCountriesForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { getStaticFile } from 'Util/API/endpoint/StaticFiles/StaticFiles.endpoint';
import { getBreadcrumbs, getBreadcrumbsUrl } from 'Util/Breadcrumbs/Breadcrubms';
import Logger from 'Util/Logger';

import PDP from './PDP.component';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    isLoading: state.PDP.isLoading,
    product: state.PDP.product,
    options: state.PDP.options,
    nbHits: state.PDP.nbHits,
    country: state.AppState.country,
    gender: state.AppState.gender,
    config: state.AppConfig.config,
    breadcrumbs: state.BreadcrumbsReducer.breadcrumbs
});

export const mapDispatchToProps = (dispatch) => ({
    requestProduct: (options) => PDPDispatcher.requestProduct(options, dispatch),
    setIsLoading: (isLoading) => dispatch(setPDPLoading(isLoading)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.then(({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch));
    },
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    setGender: (gender) => dispatch(setGender(gender)),
    setMeta: (meta) => dispatch(updateMeta(meta))
});

export class PDPContainer extends PureComponent {
    static propTypes = {
        options: PropTypes.shape({ id: PropTypes.number }).isRequired,
        requestProduct: PropTypes.func.isRequired,
        setIsLoading: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        product: Product.isRequired,
        id: PropTypes.number.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        setGender: PropTypes.func.isRequired,
        nbHits: PropTypes.number.isRequired,
        setMeta: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired,
        config: PropTypes.object.isRequired,
        breadcrumbs: PropTypes.array.isRequired,
        gender: PropTypes.string.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        firstLoad: true,
        menuCategories: null
    };

    constructor(props) {
        super(props);

        this.requestProduct();
        this.requestCategories();
    }

    componentDidUpdate(prevProps) {
        const {
            id,
            isLoading,
            setIsLoading,
            product
        } = this.props;
        const currentIsLoading = this.getIsLoading();
        const { id: prevId } = prevProps;
        const { firstLoad, menuCategories } = this.state;

        // Request product, if URL rewrite has changed
        if (id !== prevId) {
            this.requestProduct();
        }

        // Update loading from here, validate for last options recieved results from
        if (isLoading !== currentIsLoading) {
            setIsLoading(false);
        }

        if (Object.keys(product).length !== 0 && firstLoad && menuCategories) {
            this.updateBreadcrumbs();
            this.setMetaData();
            this.updateHeaderState();
        }
    }

    updateHeaderState() {
        const { changeHeaderState } = this.props;

        changeHeaderState({
            name: DEFAULT_STATE_NAME,
            isHiddenOnMobile: true
        });
    }

    async requestCategories(isUpdate = false, gender = this.props) {
        if (isUpdate) {
            // Only set loading if this is an update
            this.setState({ isLoading: true });
        }

        try {
            if (typeof gender === 'object') {
                this.setState({
                    menuCategories: await getStaticFile(CATEGORIES_STATIC_FILE_KEY, { $GENDER: gender.gender }),
                    isLoading: false
                });
            } else {
                this.setState({
                    menuCategories: await getStaticFile(CATEGORIES_STATIC_FILE_KEY, { $GENDER: gender }),
                    isLoading: false
                });
            }
        } catch (e) {
            // TODO: handle error
            Logger.log(e);
        }
    }

    updateBreadcrumbs() {
        const {
            updateBreadcrumbs,
            product: { categories, name },
            setGender,
            nbHits
        } = this.props;
        const { menuCategories } = this.state;

        if (nbHits === 1) {
            const categoriesLastLevel = categories[Object.keys(categories)[Object.keys(categories).length - 1]][0]
                .split(' /// ');

            const urlArray = getBreadcrumbsUrl(categoriesLastLevel, menuCategories);
            const breadcrumbsMapped = getBreadcrumbs(categoriesLastLevel, setGender, urlArray);
            const productBreadcrumbs = breadcrumbsMapped.reduce((acc, item) => {
                acc.unshift(item);

                return acc;
            }, []);

            const breadcrumbs = [
                {
                    url: '',
                    name: __(name)
                },
                ...productBreadcrumbs,
                {
                    url: '/',
                    name: __('Home')
                }
            ];

            updateBreadcrumbs(breadcrumbs);
            this.setState({ firstLoad: false });
        }
    }

    setMetaData() {
        const {
            setMeta, country, config, product: { brand_name: brandName, name } = {}
        } = this.props;

        if (!name) {
            return;
        }

        const countryList = getCountriesForSelect(config);
        const { label: countryName = '' } = countryList.find((obj) => obj.id === country) || {};

        setMeta({
            title: __('%s | %s | 6thStreet', brandName, name),
            keywords: __('%s %s %s online shopping', brandName, name, countryName),
            description: __(
                'Shop %s Online. Discover the latest collection from %s. Free shipping and returns.', name, brandName
            )
        });
    }

    getIsLoading() {
        const {
            id,
            options: {
                id: requestedId
            }
        } = this.props;

        return id !== requestedId;
    }

    requestProduct() {
        const { requestProduct, id } = this.props;

        // ignore product request if there is no ID passed
        if (!id) {
            return;
        }

        requestProduct({ options: { id } });
    }

    containerProps = () => {
        const { nbHits, isLoading } = this.props;
        const { isLoading: isCategoryLoading } = this.state;

        return { nbHits, isLoading, isCategoryLoading };
    };

    render() {
        const { product } = this.props;
        localStorage.setItem('PRODUCT_NAME', JSON.stringify(product.name));
        return (
            <PDP
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);
