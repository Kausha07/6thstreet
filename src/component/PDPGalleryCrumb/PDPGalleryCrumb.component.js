import PropTypes from "prop-types";
import { PureComponent } from "react";

import Image from "Component/Image";

import {
  GALLERY_IMAGE_TYPE,
  GALLERY_VIDEO_TYPE,
} from "./PDPGalleryCrumb.config";

import "./PDPGalleryCrumb.style";

class PDPGalleryCrumb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgSRC: {},
    };
  }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    type: PropTypes.number.isRequired,
    options: PropTypes.shape({
      src: PropTypes.string,
    }).isRequired,
  };

  componentDidUpdate() {
    this.setSchemaJSON();
  }

  renderMap = {
    [GALLERY_IMAGE_TYPE]: this.renderImage.bind(this),
    [GALLERY_VIDEO_TYPE]: this.renderVideo.bind(this),
  };

  renderVideo() {
    const {
      options: { src },
    } = this.props;
    return "video";
  }

  renderImage() {
    const {
      options: { src },
    } = this.props;
    this.setState({ imgSRC: src });
    if (src.includes("http")) {
      return <Image lazyLoad={false} src={src} />;
    } else {
      return (
        <div block="staticDiv">
          <img src={src} className="staticImg" />
        </div>
      );
    }
  }

  async setSchemaJSON() {
    const tag = document.createElement("script");
    if (tag) {
      tag.type = "application/ld+json";
      tag.text = JSON.stringify({
        "@type": "Product",
        "@context": "http://schema.org/",
        name: "Shivani",
        description: "Description by Shivani",
        brand: { "@type": "Thing", name: "Shivani's brand" },
        image: this.state.imgSRC,
        sku: "126098696_BLUE",
      });
      // document.querySelectorAll("script[type='application/ld+json']").forEach((node) => node.remove());
      document.head.appendChild(tag);
    }
  }

  renderType() {
    const { type } = this.props;
    return this.renderMap[type]();
  }

  render() {
    const { isActive, onClick } = this.props;

    return (
      <button block="PDPGalleryCrumb" mods={{ isActive }} onClick={onClick}>
        {this.renderType()}
      </button>
    );
  }
}

export default PDPGalleryCrumb;
