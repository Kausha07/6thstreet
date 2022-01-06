import { PureComponent } from "react";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { connect } from "react-redux";
import "./PLPLoadMore.style";
import { setProductLoading } from "Store/PLP/PLP.action";

export const mapStateToProps = (_state) => ({
  productMeta: _state.PLP.meta,
});

export const mapDispatchToProps = (_dispatch) => ({
  setProductLoading: (isLoading) => _dispatch(setProductLoading(isLoading)),
});
class PLPLoadMore extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.ref = React.createRef();
  }

  handleLoadMore(e) {
    e.preventDefault();
    const pageIndex = parseInt(this.props.pageKey) + 1;
    WebUrlParser.setPage(pageIndex);
    this.props.setProductLoading(true);
    this.ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }
  render() {
    const pageKey = parseInt(this.props.pageKey);
    const {
      productMeta: { hits_count: totalProducts, limit, page, page_count },
    } = this.props;
    let loadedProduct, progressWidth;
    let disablebtn = false;

    if (pageKey == 0) {
      loadedProduct = limit;
    }
    if (pageKey == page_count - 1) {
      disablebtn = true;

      loadedProduct =
        limit * (page_count - 1) + (totalProducts - (page_count - 1) * limit);
    }
    if (pageKey !== 0 && pageKey !== page_count - 1) {
      loadedProduct = limit * pageKey + 15;
    }
    progressWidth = (loadedProduct * 100) / totalProducts;
    return (
      <div block="Product-LoadMore" ref={this.ref}>
        <div block="Product-Loaded-Info">
          You’ve viewed {loadedProduct} of {totalProducts} products
        </div>
        <div block="Product-ProgressBar">
          <div block="Product-ProgressBar-Container">
            <div
              block="Product-ProgressBar-Bar"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </div>

        <div block="LoadMore">
          <button
            block="button"
            onClick={(e) => this.handleLoadMore(e)}
            disabled={disablebtn}
          >
            {disablebtn ? "All Products Loaded" : "Load More"}
          </button>
        </div>
      </div>
    );
  }
}

// export default PLPLoadMore;
export default connect(mapStateToProps, mapDispatchToProps)(PLPLoadMore);
