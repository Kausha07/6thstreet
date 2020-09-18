// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

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

    containerProps = () => {
        const { pages } = this.props;
        return { pages };
    };

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
