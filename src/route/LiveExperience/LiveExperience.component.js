import { PureComponent } from "react";
import Countdown from "react-countdown";
import ContentWrapper from "Component/ContentWrapper";
import isMobile from "Util/Mobile";
import "./LiveExperience.style.scss";
import cartIcon from "./icons/cart-icon.png";
import timerIcon from "./icons/timer.png";
import calenderIcon from "./icons/calendar.svg";
import playbtn from "./icons/player.svg";
import Refine from "../../component/Icons/Refine/icon.png";
import { isArabic } from "Util/App";
import UrlRewritesQuery from "Query/UrlRewrites.query";
import { fetchQuery } from "Util/Request";

import BrowserDatabase from "Util/BrowserDatabase";
import { getCurrencyCode } from "../../../packages/algolia-sdk/app/utils";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { getStore } from "Store";

export class LiveExperience extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      day: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
      isLive: false,
      archivedItemToShow: 9,
      isRefineButtonClicked: false,
      influencerSearchText: "",
      isArabic: isArabic(),
      token: "CHkWEZ9PgCdcqbzJhMtXbmYa8FuNL8xEnSrAeCXMpsKE",
      ProductDetails: {},
      item_id: null,
    };
  }

  componentDidMount() {
    (function () {
      if (!window.initBambuserLiveShopping) {
        window.initBambuserLiveShopping = function (item) {
          window.initBambuserLiveShopping.queue.push(item);
        };
        window.initBambuserLiveShopping.queue = [];
        var scriptNode = document.createElement("script");
        scriptNode["src"] = "https://lcx-embed.bambuser.com/default/embed.js";
        document.body.appendChild(scriptNode);
      }
    })();

    if (this.props.livepartyId) {
      this.onClickPartyPlay(this.props.livepartyId);
    }

    this.renderLiveParty();

    this.renderUpcomingParty();

    this.renderArchivedParty();
  }

  componentDidUpdate() {
    this.renderLiveParty();
  }

  renderLiveParty = async () => {};
  renderUpcomingParty = () => {};
  renderArchivedParty = () => {};

  renderSpckLiveEvent() {
    const content = this.props.live;
    return this.renderLiveBlock(content);
  }
  renderSpckUpcomingEvent() {
    let content = this.props.updatedUpcoming;

    // return
    return content.map(this.renderUpcomingGridBlock);
  }

  renderSpckarchivedEvent() {
    let content = this.props.updatedArchived;
    const { influencerSearchText } = this.state;
    if (!isMobile.any()) {
      content = content.slice(0, this.state.archivedItemToShow);
    }

    return content
      ?.filter((val) => {
        if (val.title.toLowerCase().includes(influencerSearchText)) {
          return val;
        }
      })
      ?.map(this.renderArchivedGridBlock);
  }

  handleLoadMore = () => {
    let count = this.state.archivedItemToShow;
    let totalProducts = this.props.updatedArchived.length;
    let itemsToShow = count + 9;
    if (itemsToShow > totalProducts) {
      itemsToShow = totalProducts;
    }
    this.setState({
      archivedItemToShow: itemsToShow,
    });
  };

  onBroadcastIdLive = () => {
    this.setState({
      isLive: true,
    });
  };

  renderLiveBlock = (block, i) => {
    const { curtains, title, scheduledStartAt, products } = block;
    const imageSRC = curtains && curtains.pending.backgroundImage;
    let d = new Date(scheduledStartAt);
    let diffInTime = d - Date.now();
    var diffInDay = diffInTime / (1000 * 3600 * 24);

    if (diffInTime < 0) {
      this.onBroadcastIdLive();
    }
    if (imageSRC) {
      return (
        <div block="spck-live-event">
          <div block="mainImage">
            <img src={imageSRC} alt={title} />
            {this.state.isLive ? (
              <div block="liveNow">
                <p block="liveNow-text">LIVE NOW</p>
              </div>
            ) : (
              <div block="eventStart">
                {diffInDay < 1 ? (
                  <div block="eventStart-timer">
                    <img src={timerIcon} alt="timerIcon" />
                    <Countdown
                      date={d}
                      daysInHours={true}
                      onComplete={this.onBroadcastIdLive}
                    />
                  </div>
                ) : (
                  <div block="eventStart-calender">
                    <img src={calenderIcon} alt="calenderIcon" />
                    <div>{`${
                      this.state.day[d.getDay()]
                    }, ${d.getDate()} at ${d.toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}`}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <a
            block="eventPlayBtn"
            disabled={!this.state.isLive}
            onClick={() => this.state.isLive && this.onClickPartyPlay(block.id)}
          >
            <img src={playbtn} alt="event-playbtn" />
            <div block="eventPlayBtn-block"></div>
          </a>
          <div block="eventInfo">
            <h3 block="eventTitle">{title}</h3>
          </div>
        </div>
      );
    }
  };

  renderUpcomingGridBlock = (block, i) => {
    const { curtains, title, description, scheduledStartAt } = block;
    const imageSRC = curtains.pending.backgroundImage;
    let d = new Date(scheduledStartAt);

    let diffInTime = d - Date.now();
    var diffInDay = diffInTime / (1000 * 3600 * 24);

    if (imageSRC) {
      return (
        <li key={i} block="spckItem">
          <div block="eventImage">
            <img src={imageSRC} alt={title} />
          </div>
          <div block="eventStart">
            {diffInDay < 1 ? (
              <div block="eventStart-timer">
                <img src={timerIcon} alt="timerIcon" />
                <Countdown date={d} daysInHours={true} />
              </div>
            ) : (
              <div block="eventStart-calender">
                <img src={calenderIcon} alt="calenderIcon" />
                <div>{`${
                  this.state.day[d.getDay()]
                }, ${d.getDate()} at ${d.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}`}</div>
              </div>
            )}
          </div>
          <a
            block="eventPlayBtn"
            onClick={() => this.onClickPartyPlay(block.id)}
          >
            {" "}
            <img src={playbtn} alt="event-playbtn" />
          </a>
          <div block="eventInfo">
            <h3 block="eventTitle">{title}</h3>
            <p block="eventDesc">{description}</p>
          </div>
        </li>
      );
    }
  };

  renderArchivedGridBlock = (block, i) => {
    // debugger
    const { curtains, title, description, products } = block;
    const imageSRC = curtains?.pending?.backgroundImage;
    if (imageSRC) {
      return (
        <li key={i} block="spckItem" id={block.id}>
          <div block="eventImage">
            <img src={imageSRC} alt={title} />
          </div>
          <div block="eventProduct">
            <img src={cartIcon} alt="cartIcon" />
            <p>{products ? products.length : ""}</p>
          </div>
          <a
            block="eventPlayBtn"
            onClick={() => this.onClickPartyPlay(block.id)}
          >
            <img src={playbtn} alt="event-playbtn" />
          </a>
          <div block="eventInfo">
            <h3 block="eventTitle">{title}</h3>
            <p block="eventDesc">{description}</p>
          </div>
        </li>
      );
    }
  };

  getProductDetails = async (id) => {
    const { token } = this.state;
    try {
      return await fetch(
        `https://liveshopping-api.bambuser.com/v1/products/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + `${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(async ({ publicUrl }) => {
          const { pathname: urlParam } = new URL(publicUrl);
          const { requestProduct } = this.props;
          const { urlResolver } = await fetchQuery(
            UrlRewritesQuery.getQuery({ urlParam })
          );
          if (urlResolver) {
            const { id } = urlResolver;
            return requestProduct({ options: { id } }).then((response) => {
              return response;
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  addToCart = (addedItem, cartId) => {
    const {
      sku,
      options: { size },
    } = addedItem;
    const { ProductDetails } = this.state;
    if (ProductDetails) {
      const { addProductToCart } = this.props;
      const {
        ProductDetails: {
          thumbnail_url,
          url,
          color,
          brand_name,
          price = {},
          sku: configSKU,
          objectID,
          simple_products,
        },
      } = this.state;
      const itemPrice = price[0][Object.keys(price[0])[0]]["6s_special_price"];
      const basePrice = price[0][Object.keys(price[0])[0]]["6s_base_price"];
      const code = Object.keys(simple_products);
      return addProductToCart(
        {
          sku,
          configSKU,
          qty: 1,
          optionId: "EU",
          optionValue: size,
          selectedClickAndCollectStore: "",
        },
        color,
        size,
        basePrice,
        brand_name,
        thumbnail_url,
        url,
        itemPrice,
        null,
        cartId
      );
    }
  };

  UpdateProductsInCart = (updatedItem, currency) => {
    const { updateProductInCart } = this.props;
    const {
      options: { size },
    } = updatedItem;
    const { item_id } = this.state;
    const {
      ProductDetails: {
        thumbnail_url,
        url,
        color,
        brand_name,
        price = {},
        discount,
        sku: configSKU,
        objectID,
        simple_products,
      },
    } = this.state;
    const itemPrice = price[0][Object.keys(price[0])[0]]["6s_special_price"];
    const basePrice = price[0][Object.keys(price[0])[0]]["6s_base_price"];
    return updateProductInCart(
      item_id,
      updatedItem.quantity,
      color,
      size,
      discount,
      brand_name,
      thumbnail_url,
      url,
      basePrice,
      currency
    );
  };

  removeProducts = (itemId) => {
    const { removeProduct } = this.props;
    return removeProduct(itemId);
  };

  onClickPartyPlay = async (bId) => {
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const [lang, country] = locale && locale.split("-");
    const currency = getCurrencyCode(country);
    let objectId = null;
    window.onBambuserLiveShoppingReady = (player) => {
      player.configure({
        currency: currency,
        locale: locale,
        buttons: {
          checkout: player.BUTTON.MINIMIZE,
        },
      });
      // Cart Integeration Code of Bambuser Live Shopping Cart
      player.on(player.EVENT.ADD_TO_CART, (addedItem, callback) => {
        const cart_id = BrowserDatabase.getItem("CART_ID_CACHE_KEY");
        const cartId =
          this.props.cartId !== "null" ? this.props.cartId : cart_id;

        this.addToCart(addedItem, cartId)
          .then((res) => {
            const {
              data: { item_id },
            } = res;
            this.setState({ item_id: item_id, cartId: cartId });
            callback(true); // item successfully added to cart
          })
          .catch((error) => {
            if (error.type === "out-of-stock") {
              // Unsuccessful due to 'out of stock'
              callback({
                success: false,
                reason: "out-of-stock",
              });
            } else {
              // Unsuccessful due to other problems
              callback(false);
            }
          });
      });

      // The user wants to change the quantity of an item in cart
      player.on(player.EVENT.UPDATE_ITEM_IN_CART, (updatedItem, callback) => {
        const { item_id } = this.state;
        if (updatedItem.quantity > 0) {
          this.UpdateProductsInCart(updatedItem, currency)
            .then(() => {
              // cart update was successful
              callback(true);
            })
            .catch(function (error) {
              if (error.type === "out-of-stock") {
                callback({
                  success: false,
                  reason: "out-of-stock",
                });
              } else {
                callback(false);
              }
            });
        }

        if (updatedItem.quantity === 0) {
          this.removeProducts(item_id)
            .then(() => {
              // successfully deleted item
              callback(true);
            })
            .catch(() => {
              // failed to delete item
              callback(false);
            });
        }
      });

      player.on(player.EVENT.CHECKOUT, () => {
        const { cartId, livepartyId } = this.props;
        if (livepartyId) {
          const payload = getStore().getState().Cart.cartId;
          window.ReactNativeWebView.postMessage(payload);
        } else {
          player.showCheckout(window.location.origin + "/cart");
        }
      });

      // player.on(player.EVENT.SYNC_CART_STATE, () => {
      //   // Use your method to check if the user has checkout
      //   const { cart_id } = this.state;
      //   console.log("running", this.getCartTotals(cart_id));
      //   if (this.getCartTotals(cart_id))  {
      //     // Emptying the in-player cart
      //     player.updateCart({
      //       items: [],
      //     });
      //   }
      // });

      player.on(player.EVENT.PROVIDE_PRODUCT_DATA, (event) => {
        event.products.forEach(async ({ id }) => {
          objectId = id;
          const yourProduct = await this.getProductDetails(id);
          const {
            brand_name,
            description,
            name,
            price,
            sku,
            color,
            gallery_images,
            simple_products,
          } = yourProduct.data;
          this.setState({ ProductDetails: yourProduct.data });
          player.updateProduct(id, (productFactory) =>
            productFactory.product((productDetailFactory) =>
              productDetailFactory
                .name(name)
                .brandName(brand_name)
                .description(description)
                .sku(sku)
                .defaultVariationIndex(0)
                .variations((variationFactory) => [
                  variationFactory()
                    .attributes((attributeFactory) =>
                      attributeFactory.colorName(color)
                    )
                    .imageUrls(gallery_images)
                    .name(color)
                    .sku(sku)
                    .sizes((sizeFactory) =>
                      Object.keys(simple_products).map((VarientSku) =>
                        sizeFactory()
                          .name(simple_products[VarientSku].size.eu)
                          .inStock(simple_products[VarientSku].quantity > 0)
                          .sku(VarientSku)
                          .price((priceFactory) =>
                            priceFactory
                              .current(price[0][currency]["6s_special_price"])
                              .original(price[0][currency]["6s_base_price"])
                          )
                      )
                    ),
                ])
            )
          );
        });
      });
    };

    window.initBambuserLiveShopping({
      showId: bId,
      type: "overlay",
    });
  };

  handleRefineButtonClick = () => {
    const { isRefineButtonClicked } = this.state;
    this.setState({
      isRefineButtonClicked: !isRefineButtonClicked,
    });
  };

  handleSearchInfluencerText = (e) => {
    this.setState({ influencerSearchText: e.target.value });
  };

  renderRefine() {
    const { isArabic, isRefineButtonClicked } = this.state;

    return (
      <div block="refineButton-div" elem="Refine" mods={{ isArabic }}>
        {isRefineButtonClicked ? (
          <input
            type="text"
            block="influencerSearchInput"
            mods={{ isArabic }}
            placeholder="Search For Influencer title"
            onChange={this.handleSearchInfluencerText}
          />
        ) : (
          ""
        )}
        <button block="refine-button" onClick={this.handleRefineButtonClick}>
          {" "}
          <img block="refineImage" mods={{ isArabic }} src={Refine} />{" "}
          {__("search")}
        </button>
      </div>
    );
  }

  render() {
    let archProducts = this.state.archivedItemToShow;
    let totalProducts = this.props.updatedArchived.length;
    let progressWidth = (archProducts * 100) / totalProducts;
    const { isArabic } = this.state;

    return (
      <>
        {this.props.livepartyId ? (
          <div></div>
        ) : (
          <main block="LiveShopping">
            <div block="catergoryBlockLayout" mods={{ isArabic }}>
              <div block="GenderButton-Container">
                <a href="/all.html">
                  <button block="GenderButton-Button">{__("All")}</button>
                </a>
              </div>
              <div block="GenderButton-Container">
                <a href="/women.html">
                  <button block="GenderButton-Button">{__("Women")}</button>
                </a>
              </div>
              <div block="GenderButton-Container">
                <a href="/men.html">
                  <button block="GenderButton-Button">{__("Men")}</button>
                </a>
              </div>
            </div>

            <ContentWrapper
              mix={{ block: "LiveShopping" }}
              wrapperMix={{
                block: "LiveShopping",
                elem: "Wrapper",
              }}
              label={__("LiveShopping")}
            >
              <div block="liveEventBanner">{this.renderSpckLiveEvent()}</div>

              {this.props.updatedUpcoming.length > 0 && (
                <div block="upComing-Grid">
                  <h3 block="sectionTitle">{__("COMING NEXT")}</h3>
                  <div id="live"></div>
                  <ul block="spckItems">{this.renderSpckUpcomingEvent()}</ul>
                </div>
              )}

              {this.props.updatedArchived.length > 0 && (
                <div block="archived-Grid">
                  <div block="Recentlyplayed-heading-layout">
                    <h3 block="sectionTitle">{__("RECENTLY PLAYED")}</h3>
                    <div block="RecentlyPlayed-refine-button">
                      {this.renderRefine()}
                    </div>
                  </div>
                  <div id="archived"></div>
                  <ul block="spckItems">{this.renderSpckarchivedEvent()}</ul>
                </div>
              )}

              {this.props.updatedArchived.length > 9 && !isMobile.any() ? (
                <div block="Product-LoadMore">
                  {
                    <>
                      <div block="Product-Loaded-Info">
                        {__(
                          "You’ve viewed %s of %s products",
                          archProducts,
                          totalProducts
                        )}
                      </div>

                      <div block="Product-ProgressBar">
                        <div block="Product-ProgressBar-Container">
                          <div
                            block="Product-ProgressBar-Bar"
                            style={{ width: `${progressWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  }

                  <div block="LoadMore">
                    <button
                      block="button"
                      onClick={this.handleLoadMore}
                      // disabled={disablebtn || this.props.productLoad}
                      ref={this.buttonRef}
                    >
                      {__("Load More")}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </ContentWrapper>
            <div id="all"></div>
          </main>
        )}
      </>
    );
  }
}

export default LiveExperience;
