
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
        // this.state = {
        //     wasRequested: false            
        // };
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }


    handleLoadMore(e) {
        e.preventDefault();
        const pageIndex = parseInt(this.props.pageKey) + 1;
        WebUrlParser.setPage(pageIndex);
    }
    render() {
        const pageKey = this.props.pageKey;
        
        const  { productMeta: { hits_count: totalProducts, limit, page, page_count : totalPageCount} } = this.props
        //const pageKey = this.props.pageKey;

        //let page_count = totalPageCount - 1;
        let page_count = totalPageCount;
        //console.log("load more pp", totalProducts, limit, page, page_count )
        let loadedProduct = limit * pageKey;
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
                    <button block="button" onClick={(e) => this.handleLoadMore(e)}>Load More</button>
                </div>

            </div>
        )

    }
}

// export default PLPLoadMore;
export default connect(mapStateToProps)(PLPLoadMore);;