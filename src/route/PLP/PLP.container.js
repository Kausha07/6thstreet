import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setPLPLoading } from 'Store/PLP/PLP.action';
import PLPDispatcher from 'Store/PLP/PLP.dispatcher';
import { Pages, RequestedOptions } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLP from './PLP.component';

export const mapStateToProps = (state) => ({
    gender: state.AppState.gender,
    locale: state.AppState.locale,
    requestedOptions: state.PLP.options,
    isLoading: state.PLP.isLoading,
    pages: state.PLP.pages
});

export const mapDispatchToProps = (dispatch, state) => ({
    requestProductList: (options) => PLPDispatcher.requestProductList(options, dispatch, state),
    requestProductListPage: (options) => PLPDispatcher.requestProductListPage(options, dispatch),
    setIsLoading: (isLoading) => dispatch(setPLPLoading(isLoading))
});

export class PLPContainer extends PureComponent {
    static propTypes = {
        gender: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired,
        requestProductList: PropTypes.func.isRequired,
        requestProductListPage: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        setIsLoading: PropTypes.func.isRequired,
        requestedOptions: RequestedOptions.isRequired,
        pages: Pages.isRequired
    };

    static requestProductList = PLPContainer.request.bind({}, false);

    static requestProductListPage = PLPContainer.request.bind({}, true);

    static getDerivedStateFromProps(props, state) {
        const { pages } = props;
        const requestOptions = PLPContainer.getRequestOptions();
        const { page, ...restOptions } = requestOptions;

        const {
            prevRequestOptions: {
                page: prevPage,
                ...prevRestOptions
            }
        } = state;

        if (JSON.stringify(restOptions) !== JSON.stringify(prevRestOptions)) {
            // if queries match (excluding pages) => not inital
            PLPContainer.requestProductList(props);
        } else if (page !== prevPage && !pages[page]) {
            // if only page has changed, and it is not yet loaded => request that page
            PLPContainer.requestProductListPage(props);
        }

        return {
            prevRequestOptions: requestOptions
        };
    }

    static getRequestOptions() {
        const {
            params: parsedParams
        } = WebUrlParser.parsePLP(location.href);

        return {
            // TODO: inject gender ?
            ...parsedParams
        };
    }

    static async request(isPage, props) {
        const { requestProductList, requestProductListPage } = props;
        const options = PLPContainer.getRequestOptions();
        const requestFunction = isPage ? requestProductListPage : requestProductList;
        requestFunction({ options });
    }

    state = {
        prevRequestOptions: PLPContainer.getRequestOptions()
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        if (this.getIsLoading()) {
            PLPContainer.requestProductList(props);
        }
    }

    componentDidUpdate() {
        const { isLoading, setIsLoading } = this.props;
        const currentIsLoading = this.getIsLoading();

        // update loading from here, validate for last
        // options recieved results from
        if (isLoading !== currentIsLoading) {
            setIsLoading(currentIsLoading);
        }
    }

    getIsLoading() {
        const { requestedOptions } = this.props;
        const options = PLPContainer.getRequestOptions();

        const {
            // eslint-disable-next-line no-unused-vars
            page: requestedPage,
            ...requestedRestOptions
        } = requestedOptions;

        const {
            // eslint-disable-next-line no-unused-vars
            page,
            ...restOptions
        } = options;

        // If requested options are not matching requested options -> we are loading
        // we also ignore pages, this is handled by PLPPages
        return JSON.stringify(requestedRestOptions) !== JSON.stringify(restOptions);
    }

    containerProps = () => ({
        // isDisabled: this._getIsDisabled()
    });

    render() {
        return (
            <PLP
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PLPContainer)
);
