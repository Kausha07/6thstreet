import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import UrlRewritesQuery from 'Query/UrlRewrites.query';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { LocationType } from 'Type/Common';
import history from 'Util/History';
import { fetchQuery } from 'Util/Request';

import UrlRewrites from './UrlRewrites.component';
import { TYPE_CATEGORY, TYPE_NOTFOUND, TYPE_PRODUCT } from './UrlRewrites.config';

export const mapStateToProps = (state) => ({
    locale: state.AppState.locale
});

export const mapDispatchToProps = (_dispatch) => ({
    hideActiveOverlay: () => _dispatch(hideActiveOverlay())
});

export class UrlRewritesContainer extends PureComponent {
    static propTypes = {
        location: LocationType.isRequired,
        locale: PropTypes.string.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        prevPathname: '',
        isLoading: true,
        type: '',
        id: -1,
        sku: '',
        query: ''
    };

    constructor(props) {
        super(props);

        this.requestUrlRewrite();
    }

    componentDidUpdate(prevProps, prevState) {
        const { pathname } = location;
        const { locale, hideActiveOverlay } = this.props;
        const { locale: prevLocale } = prevProps;
        const { prevPathname, query } = this.state;
        const { prevPathname: prevStatePathname } = prevState;

        if (!location.search && query) {
            history.push(`${pathname}?${query}`);
        }

        if (
            pathname !== prevPathname
            || locale !== prevLocale || !prevStatePathname
        ) {
            hideActiveOverlay();
            document.body.style.overflow = 'visible';
            // Request URL rewrite if pathname or locale changed
            this.requestUrlRewrite(true);
        }
    }

    async requestUrlRewrite(isUpdate = false) {
        // TODO: rename this to pathname, urlParam is strange
        const { pathname: urlParam = '' } = location;
        const slicedUrl = urlParam.slice(urlParam.search('id/'));
        // eslint-disable-next-line no-magic-numbers
        const magentoProductId = Number((slicedUrl.slice('3')).split('/')[0]);
        const possibleSku = this.getPossibleSku();

        if (isUpdate) {
            this.setState({
                prevPathname: urlParam,
                isLoading: true
            });
        }

        // TODO: switch to "executeGet" afterwards
        const { urlResolver } = await fetchQuery(UrlRewritesQuery.getQuery({ urlParam }));
        const {
            type = magentoProductId || possibleSku ? TYPE_PRODUCT : TYPE_NOTFOUND,
            id,
            data: { url: query }
        } = urlResolver || {data: {}};
        const finalType = type === TYPE_NOTFOUND && decodeURI(location.search).match(/idx=/)
            ? TYPE_CATEGORY
            : type;

        window.pageType = finalType;

        this.setState({
            prevPathname: urlParam,
            isLoading: false,
            type: finalType,
            id: id === undefined ? magentoProductId : id,
            sku: possibleSku,
            query
        });
    }

    getPossibleSku() {
        const { pathname } = location;

        const uriElements = pathname.substr(0, pathname.indexOf('.html')).substr(1).split('-');

        const result = uriElements.reduce((acc, element) => {
            if (/\d/.test(element) || acc.length !== 0) {
                acc.push(element);
            }

            return acc;
        }, []).join('-');

        return result.length ? result : false;
    }

    containerProps = () => {
        const {
            isLoading,
            type,
            id,
            sku
        } = this.state;

        return {
            isLoading,
            type,
            id,
            sku
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
