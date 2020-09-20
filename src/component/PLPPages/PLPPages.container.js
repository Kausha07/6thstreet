// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { PLPContainer } from 'Route/PLP/PLP.container';
import { Pages } from 'Util/API/endpoint/Product/Product.type';

import PLPPages from './PLPPages.component';

export const mapStateToProps = (state) => ({
    pages: state.PLP.pages
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PLPPagesContainer extends PureComponent {
    static propTypes = {
        pages: Pages.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => ({
        pages: this.getPages()
    });

    getPages() {
        const { pages } = this.props;
        const { page } = PLPContainer.getRequestOptions();

        return Array.from({
            // assume there are pages before and after our current page
            length: page + 1
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
