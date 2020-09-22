// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { PLPContainer } from 'Route/PLP/PLP.container';
import { Meta, Pages } from 'Util/API/endpoint/Product/Product.type';

import PLPPages from './PLPPages.component';

export const mapStateToProps = (state) => ({
    pages: state.PLP.pages,
    meta: state.PLP.meta
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PLPPagesContainer extends PureComponent {
    static propTypes = {
        pages: Pages.isRequired,
        meta: Meta.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => ({
        pages: this.getPages()
    });

    getPages() {
        const { pages, meta } = this.props;
        const { page_count } = meta;

        // If lastRequestedPage === -Infinity -> assume it's -1, else use value, i.e. 0
        const lastRequestedPage = Math.max(...Object.keys(pages));
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
        return (
            <PLPPages
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPPagesContainer);
