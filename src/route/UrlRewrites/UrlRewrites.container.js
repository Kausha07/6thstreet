import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import UrlRewritesQuery from 'Query/UrlRewrites.query';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { LocationType } from 'Type/Common';
import { fetchQuery } from 'Util/Request';

import UrlRewrites from './UrlRewrites.component';
import { TYPE_NOTFOUND } from './UrlRewrites.config';

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
        id: -1
    };

    constructor(props) {
        super(props);

        this.requestUrlRewrite();
    }

    componentDidUpdate(prevProps) {
        const { location: { pathname }, locale, hideActiveOverlay } = this.props;
        const { locale: prevLocale } = prevProps;
        const { prevPathname } = this.state;

        if (
            pathname !== prevPathname
            || locale !== prevLocale
        ) {
            hideActiveOverlay();
            // Request URL rewrite if pathname or locale changed
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
        const { type = TYPE_NOTFOUND, id } = urlResolver || {};

        window.pageType = type;

        this.setState({
            prevPathname: urlParam,
            isLoading: false,
            type,
            id
        });
    }

    containerProps = () => {
        const {
            isLoading,
            type,
            id
        } = this.state;

        return {
            isLoading,
            type,
            id
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
