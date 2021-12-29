
import { PureComponent } from "react";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { connect } from "react-redux";
import "./PLPLoadMore.style";

export const mapStateToProps = (_state) => ({
    productMeta: _state.PLP.meta
});

class PLPLoadMore extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wasRequested: false,
        };
    }


    handleLoadMore() {

        const pageIndex = parseInt(this.props.pageKey) + 1;
        // const { wasRequested } = this.state;
        // if (isVisible && !wasRequested) {

        //this.setState({ wasRequested: true });
        WebUrlParser.setPage(pageIndex);
        // }
    }
    render() {
        const { productMeta: { hits_count: totalProducts, limit, page, page_count } } = this.props
        const pageKey = this.props.pageKey;

        let loadedProduct = limit * pageKey;
        //let lastPage = page_count - 1;
        let lastPageProduct = totalProducts - ((page_count - 1) * limit);
        if (page_count == pageKey) {
            loadedProduct = limit * (page_count - 1);
            loadedProduct = loadedProduct + lastPageProduct;
        }
        let progressWidth = loadedProduct * 100 / totalProducts;
        return (
            <div block="Product-LoadMore">
                <div block="Product-Loaded-Info">
                    You’ve viewed {loadedProduct} of {totalProducts} products
            </div>
                <div block="Product-ProgressBar">
                    <div block="Product-ProgressBar-Container">
                        <div block="Product-ProgressBar-Bar" style={{ width: `${progressWidth}%` }}></div>
                    </div>
                </div>
                <div block="LoadMore">
                    <button block="button" onClick={() => this.handleLoadMore()}>Load More</button>
                </div>

            </div>
        )

    }
}

// export default PLPLoadMore;
export default connect(mapStateToProps)(PLPLoadMore);;