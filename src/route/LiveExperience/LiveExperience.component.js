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
    const { curtains, title, scheduledStartAt } = block;
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
              <p block="eventStart">
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
              </p>
            )}
          </div>
          <a
            block="eventPlayBtn"
            onClick={() => this.onClickPartyPlay(block.id)}
          >
            <img src={playbtn} alt="event-playbtn" />
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
        <li block="spckItem">
          <div block="eventImage">
            <img src={imageSRC} alt={title} />
          </div>
          <p block="eventStart">
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
          </p>
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

  renderArchivedGridBlock = (block, i) => {
    // debugger
    const { curtains, title, description, productHighlights } = block;
    let imageSRC = curtains.pending.backgroundImage;
    if (imageSRC) {
      return (
        <li block="spckItem" id={block.id}>
          <div block="eventImage">
            <img src={imageSRC} alt={title} />
          </div>
          <p block="eventProduct">
            <img src={cartIcon} alt="cartIcon" />
            <div>{productHighlights ? productHighlights.length : ""}</div>
          </p>
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

  onClickPartyPlay = (bId) => {
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
    );
  }
}

export default LiveExperience;
