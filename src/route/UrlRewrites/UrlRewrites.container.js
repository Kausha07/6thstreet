import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import UrlRewritesQuery from 'Query/UrlRewrites.query';
import { LocationType } from 'Type/Common';
import { fetchQuery } from 'Util/Request';

import UrlRewrites from './UrlRewrites.component';
import { TYPE_NOTFOUND } from './UrlRewrites.config';

export const mapStateToProps = (state) => ({
    locale: state.AppState.locale
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class UrlRewritesContainer extends PureComponent {
    static propTypes = {
        location: LocationType.isRequired,
        locale: PropTypes.string.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        prevPathname: '',
        isLoading: true,
        type: ''
    };

    constructor(props) {
        super(props);

        this.requestUrlRewrite();
    }

    componentDidUpdate(prevProps) {
        const { location: { pathname }, locale } = this.props;
        const { locale: prevLocale } = prevProps;
        const { prevPathname } = this.state;

        // Request URL rewrite if pathname or locale changed
        if (
            pathname !== prevPathname
            || locale !== prevLocale
        ) {
            this.requestUrlRewrite(true);
        }
    }

    async requestUrlRewrite(isUpdate = false) {
        // TODO: rename this to pathname, urlParam is strange
        const { location: { pathname: urlParam } } = this.props;

        if (isUpdate) {
            this.setState({
                prevPathname: urlParam,
                isLoading: true
            });
        }

        // TODO: switch to "executeGet" afterwards
        const { urlResolver } = await fetchQuery(UrlRewritesQuery.getQuery({ urlParam }));
        const { type = TYPE_NOTFOUND } = urlResolver || {};

        this.setState({
            prevPathname: urlParam,
            isLoading: false,
            type
        });
    }

    containerProps = () => {
        const {
            isLoading,
            type
        } = this.state;

        return {
            isLoading,
            type
        };
    };

    render() {
        return (
            <UrlRewrites
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlRewritesContainer);
