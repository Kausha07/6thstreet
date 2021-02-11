import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { PLPContainer } from 'Route/PLP/PLP.container';
import { Meta, Pages } from 'Util/API/endpoint/Product/Product.type';

import PLPPages from './PLPPages.component';

export const mapStateToProps = (state) => ({
    pages: state.PLP.pages,
    meta: state.PLP.meta
});

export class PLPPagesContainer extends PureComponent {
    static propTypes = {
        pages: Pages.isRequired,
        meta: Meta.isRequired
    };

    state = {
        pages: {},
        impressions: []
    };

    static getDerivedStateFromProps(props, state) {
        const { pages = {} } = props;
        const { pages: prevPages = {} } = state;

        if (Object.keys(pages).length !== Object.keys(prevPages).length) {
            return {
                pages,
                impressions: Object.keys(pages).flatMap((key) => pages[key])
            };
        }

        return null;
    }

    containerProps = () => ({
        pages: this.getPages()
    });

    getPages() {
        const { pages = {}, meta } = this.props;
        const { page_count } = meta;

        // If lastRequestedPage === -Infinity -> assume it's -1, else use value, i.e. 0
        const filteredPages = Object.keys(pages).filter((page) => page !== 'undefined');
        const lastRequestedPage = Math.max(...Object.keys(filteredPages));
        const page = lastRequestedPage < 0 ? -1 : lastRequestedPage;
        const pagesToShow = page + 2;
        const maxPage = page_count + 1;

        // assume there are pages before and after our current page
        return Array.from({
            // cap the placeholders from showing above the max page
            length: pagesToShow < maxPage ? pagesToShow : maxPage
        }, (_, pageIndex) => ({
            isPlaceholder: !pages[pageIndex],
            products: pages[pageIndex] || []
        }));
    }

    getIsLoading() {
        const { pages } = this.props;
        const { page } = PLPContainer.getRequestOptions();

        // If the page in URL is not yet present -> we are loading
        return !pages[page];
    }

    render() {
        const { impressions } = this.state;

        return (
            <PLPPages
              impressions={ impressions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps)(PLPPagesContainer);
