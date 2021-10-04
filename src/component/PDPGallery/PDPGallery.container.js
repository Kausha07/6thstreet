import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { setPDPGaleryImage } from "Store/PDP/PDP.action";
import { Product } from "Util/API/endpoint/Product/Product.type";
import PDPGallery from "./PDPGallery.component";

export const mapStateToProps = (state) => ({
  currentIndex: state.PDP.imageIndex,
  isLoading: state.PDP.isLoading,
  product: state.PDP.product,
});

export const mapDispatchToProps = (_dispatch) => ({
  setImageIndex: (index) => _dispatch(setPDPGaleryImage(index)),
});

export class PDPGalleryContainer extends PureComponent {
  static propTypes = {
    currentIndex: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    product: Product.isRequired,
    setImageIndex: PropTypes.func.isRequired,
    index: PropTypes.number,
  };

  static defaultProps = {
    index: 0,
  };

  containerFunctions = {
    onSliderChange: this.onSliderChange.bind(this),
  };

  containerProps = () => {
    const { currentIndex, product } = this.props;

    return {
      gallery: this.getGallery(),
      crumbs: this.getCrumbs(),
      currentIndex,
      product,
    };
  };

  onSliderChange(activeSlide) {
    const { setImageIndex } = this.props;

    return setImageIndex(activeSlide);
  }

  getCrumbs() {
    // TODO: determine if has video append it here
    const galleryCrumbs = Object.keys(this.getGallery() || {});
    return galleryCrumbs;
  }

  getGallery() {
    const {
      isLoading,
      product: { gallery_images = [] },
    } = this.props;

    if (isLoading || gallery_images.length === 0) {
      return Array.from({ length: 4 });
    }

    return gallery_images;
  }

  render() {
    const {
      product: { sku = "" },
      product,
    } = this.props;
    return (
      <PDPGallery
        {...this.containerFunctions}
        {...this.containerProps()}
        sku={sku}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDPGalleryContainer);
