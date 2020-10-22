import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { setGender } from 'Store/AppState/AppState.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { setPDPLoading } from 'Store/PDP/PDP.action';
import PDPDispatcher from 'Store/PDP/PDP.dispatcher';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { getBreadcrumbs } from 'Util/Breadcrumbs/Breadcrubms';

import PDP from './PDP.component';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    isLoading: state.PDP.isLoading,
    product: state.PDP.product,
    options: state.PDP.options
});

export const mapDispatchToProps = (dispatch) => ({
    requestProduct: (options) => PDPDispatcher.requestProduct(options, dispatch),
    setIsLoading: (isLoading) => dispatch(setPDPLoading(isLoading)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.then(({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch));
    },
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    setGender: (gender) => dispatch(setGender(gender))
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
        setGender: PropTypes.func.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        firstLoad: true
    };

    constructor(props) {
        super(props);

        this.requestProduct();
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
        const { firstLoad } = this.state;

        // Request product, if URL rewrite has changed
        if (id !== prevId) {
            this.requestProduct();
        }

        // Update loading from here, validate for last options recieved results from
        if (isLoading !== currentIsLoading) {
            setIsLoading(false);
        }

        if (Object.keys(product).length !== 0 && firstLoad) {
            this.updateBreadcrumbs();
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

    updateBreadcrumbs() {
        const {
            updateBreadcrumbs,
            product: { categories, name },
            setGender
        } = this.props;
        const categoriesLastLevel = categories[Object.keys(categories)[Object.keys(categories).length - 1]][0]
            .split(' /// ');

        const breadcrumbsMapped = getBreadcrumbs(categoriesLastLevel, setGender);
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
        // isDisabled: this._getIsDisabled()
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
