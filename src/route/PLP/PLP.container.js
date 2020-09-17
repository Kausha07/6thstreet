import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setPLPLoading } from 'Store/PLP/PLP.action';
import PLPDispatcher from 'Store/PLP/PLP.dispatcher';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLP from './PLP.component';

export const mapStateToProps = (state) => ({
    gender: state.AppState.gender,
    locale: state.AppState.locale,
    requestedOptions: state.PLP.options,
    isLoading: state.PLP.isLoading
});

export const mapDispatchToProps = (dispatch) => ({
    requestProduct: (options) => PLPDispatcher.requestProducts(options, dispatch),
    setIsLoading: (isLoading) => dispatch(setPLPLoading(isLoading))
});

export class PLPContainer extends PureComponent {
    static propTypes = {
        gender: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired,
        requestProduct: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        setIsLoading: PropTypes.func.isRequired,
        // TODO: change to proper type
        requestedOptions: PropTypes.object.isRequired
    };

    static getDerivedStateFromProps(props, state) {
        const { prevHref, prevQ } = state;
        const { href } = location;
        const q = PLPContainer.getQuery();

        // TODO: this is probably a poor check!
        if (prevHref === href) {
            return null;
        }

        // if queries match => not inital
        PLPContainer.requestProductList(
            props,
            q !== prevQ
        );

        return {
            prevQ: q,
            prevHref: href
        };
    }

    static getRequestOptions() {
        const {
            params: parsedParams
        } = WebUrlParser.parsePLP(location.href);

        return {
            // TODO: inject gender ?
            ...parsedParams,
            // TODO switch sort ?
            sort: 'recommended'
        };
    }

    static async requestProductList(props) {
        const { requestProduct } = props;
        const options = PLPContainer.getRequestOptions();
        requestProduct({ options });
    }

    static getQuery() {
        return new URL(location.href).searchParams.get('q');
    }

    state = {
        prevHref: location.href,
        prevQ: PLPContainer.getQuery()
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        const {
            requestedOptions: { q }
        } = props;

        if (this.getIsLoading()) {
            // if queries match => not inital
            PLPContainer.requestProductList(
                props,
                q !== PLPContainer.getQuery()
            );
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

        // if requested options are not matching requested options -> we are loading
        return JSON.stringify(requestedOptions) !== JSON.stringify(options);
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
