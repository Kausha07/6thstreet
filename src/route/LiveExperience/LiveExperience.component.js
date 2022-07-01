import { PureComponent } from "react";
import Countdown from "react-countdown";
import ContentWrapper from 'Component/ContentWrapper';
import isMobile from "Util/Mobile";
import './LiveExperience.style.scss';
import cartIcon from './icons/cart-icon.png';
import timerIcon from './icons/timer.png';
import calenderIcon from './icons/calendar.svg'
import playbtn from './icons/player.svg';

export class LiveExperience extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      day: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
      isLive: false,
      archivedItemToShow: 9,
      isRefineButtonClicked : false,
      influencerSearchText : ""
    };
  }

  componentDidMount() {

    (function () {
      var spck = {
        storeId: "13207961",
        storeType: "sixthstreet",
        customColor: '#000000',
        containerId: 'all',
        displayType: 'all',
        staging: process.env.REACT_APP_SPOCKEE_STAGING
      };
      var el = document.createElement('script');
      el.setAttribute('src', 'https://party.spockee.io/builder/' + spck.storeId);
      el.setAttribute('data-spck', JSON.stringify(spck));
      document.body.appendChild(el);
    })();

    if (this.props.broadcastId) {
      this.renderLiveParty();
    }
    else {
      this.renderUpcomingParty();
      this.renderArchivedParty();
    }

  }
  componentDidUpdate() {
    if (this.props.broadcastId) {
      this.renderLiveParty();
    }
  }

  renderLiveParty = async () => { };
  renderUpcomingParty = () => { };
  renderArchivedParty = () => { };


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
    //const content = this.props.archived;
    let content = this.props.updatedArchived;
    const { influencerSearchText } = this.state;
    if (!isMobile.any()) {
      content = content.slice(0, this.state.archivedItemToShow);
    }

    return content?.filter((val) => {
        if( val.name.toLowerCase().includes(influencerSearchText.toLowerCase())) {
          return val;
        }
    })?.map(this.renderArchivedGridBlock);
  }


  handleLoadMore = () => {
    let count = this.state.archivedItemToShow;
    let totalProducts = this.props.updatedArchived.length
    let itemsToShow = count + 9
    if (itemsToShow > totalProducts) {
      itemsToShow = totalProducts
    }
    this.setState({
      archivedItemToShow: itemsToShow
    })
  }

  onBroadcastIdLive = () => {
    this.setState({
      isLive: true
    })
  }

  renderLiveBlock = (block, i) => {
    const { mainImageURI, squareImageURI, name, description, starts } = block;
    let d = new Date(starts);
    let diffInTime = d - Date.now();
    var diffInDay = diffInTime / (1000 * 3600 * 24);

    if (diffInTime < 0) {
      this.onBroadcastIdLive();
    }
    if (mainImageURI) {
      return (
        <div block="spck-live-event">
          <div block="mainImage">
            <img src={mainImageURI} alt={name} />
            {this.state.isLive ?
              <div block="liveNow">
                <p block="liveNow-text">LIVE NOW</p>
              </div>
              :
              <p block="eventStart">
                {
                  diffInDay < 1 ?
                    <div block="eventStart-timer">
                      <img src={timerIcon} alt="timerIcon" />
                      <Countdown
                        date={d}
                        daysInHours={true}
                        onComplete={this.onBroadcastIdLive}
                      />
                    </div>
                    :
                    <div block="eventStart-calender">
                      <img src={calenderIcon} alt="calenderIcon" />
                      <div>{`${this.state.day[d.getDay()]}, ${d.getDate()} at ${d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}</div>
                    </div>
                }
              </p>

            }

          </div>
          <a block="eventPlayBtn" disabled={!this.state.isLive} onClick={() => this.state.isLive && this.onClickPartyPlay(block.id)}><img src={playbtn} alt="event-playbtn" /><div block="eventPlayBtn-block"></div></a>
          <div block="eventInfo">
            <h3 block="eventTitle">{name}</h3>
          </div>

        </div>
      )
    }
  };


  renderUpcomingGridBlock = (block, i) => {
    const { mainImageURI, squareImageURI, name, description, starts, products } = block;
    let d = new Date(starts);

    let diffInTime = d - Date.now();
    var diffInDay = diffInTime / (1000 * 3600 * 24);

    if (mainImageURI) {
      return (
        <li block="spckItem">
          <div block="eventImage">
            <img src={mainImageURI} alt={name} />
          </div>
          <p block="eventStart">
            {
              diffInDay < 1 ?
                <div block="eventStart-timer">
                  <img src={timerIcon} alt="timerIcon" />
                  <Countdown
                    date={d}
                    daysInHours={true}
                  />
                </div>
                :
                <div block="eventStart-calender">
                  <img src={calenderIcon} alt="calenderIcon" />
                  <div>{`${this.state.day[d.getDay()]}, ${d.getDate()} at ${d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}</div>
                </div>
            }
          </p>

          <div block="eventInfo">
            <h3 block="eventTitle">{name}</h3>
            <p block="eventDesc">{description}</p>
          </div>
        </li>
      )
    }
  };

  renderArchivedGridBlock = (block, i) => {
    // debugger
    const { mainImageURI, name, description, productHighlights } = block;
    console.log("mainImageURI", mainImageURI,name,description,productHighlights);
    if (mainImageURI) {
      return (
        <li block="spckItem" id={block.id}>
          <div block="eventImage">
            <img src={mainImageURI} alt={name} />
          </div>
          <p block="eventProduct">
            <img src={cartIcon} alt="cartIcon" />
            <div>{productHighlights ? productHighlights.length : ""}</div>
          </p>
          <a block="eventPlayBtn" onClick={() => this.onClickPartyPlay(block.id)} ><img src={playbtn} alt="event-playbtn" /></a>
          <div block="eventInfo">
            <h3 block="eventTitle">{name}</h3>
            <p block="eventDesc">{description}</p>
          </div>
        </li>
      )
    }
  };
  onClickPartyPlay = (bId) => {

    // let newId = id.toString();
    // let ele = document.getElementsByClassName("spck-watch-button");
    // for (let i = 0; i < ele.length; i++) {
    //   let dataInfo = JSON.parse(ele[i].getAttribute("data-info"));
    //   if (dataInfo["spckId"] === newId) {
    //     ele[i].click();
    //   }
    // }

    const openSPEvent = new CustomEvent('spockeeOpenShoppingParty', {
      detail: {
        id: bId,
        time: 0
      }
    });


    window.dispatchEvent(openSPEvent);




  }

  handleRefineButtonClick = () => {
    const { isRefineButtonClicked } = this.state;
    this.setState({
      isRefineButtonClicked : !isRefineButtonClicked
    });
  }

  handleSearchInfluencerText = (e) => {
    const { influencerSearchText } = this.state;
    this.setState({influencerSearchText: e.target.value});
    console.log("text",influencerSearchText);
  }

  renderRefine() {
    const { isArabic,isRefineButtonClicked } = this.state;

    return (
      <div block="refineButton-div" elem="Refine" mods={{ isArabic }}>
        {(isRefineButtonClicked) ? <input type="text" block="influencerSearchInput" placeholder="Search for influencer" onChange = { this.handleSearchInfluencerText}/> : ""}
        <button block= "refine-button" onClick = { this.handleRefineButtonClick }>{__("refine")}</button>
      </div>
    );
  }


  render() {
    let archProducts = this.state.archivedItemToShow
    let totalProducts = this.props.updatedArchived.length
    let progressWidth = (archProducts * 100) / totalProducts;

    return (
      <main block="LiveShopping">

        <ContentWrapper
          mix={{ block: 'LiveShopping' }}
          wrapperMix={{
            block: 'LiveShopping',
            elem: 'Wrapper'
          }}
          label={__('LiveShopping')}
        >

          <div block="liveEventBanner">
            {this.renderSpckLiveEvent()}
          </div>

          {
            this.props.updatedUpcoming.length > 0 &&
            <div block="upComing-Grid">
              <h3 block="sectionTitle">{__("COMING NEXT")}</h3>
              <div id="live"></div>
              <ul block="spckItems">
                {this.renderSpckUpcomingEvent()}
              </ul>
            </div>
          }


          {this.props.updatedArchived.length > 0 &&
            <div block="archived-Grid">
              <div block="Recentlyplayed-heading-layout">
                <h3 block="sectionTitle">{__("RECENTLY PLAYED")}</h3>
                <div>{this.renderRefine()}</div>
              </div>
              <div id="archived"></div>
              <ul block="spckItems">
                {this.renderSpckarchivedEvent()}
              </ul>
            </div>
          }
          {
            this.props.updatedArchived.length > 9 && (!isMobile.any()) ?

              <div block="Product-LoadMore">
                {
                  <>
                    <div block="Product-Loaded-Info">
                      {__("You’ve viewed %s of %s products", archProducts, totalProducts)}
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

              :
              ""
          }


        </ContentWrapper>
        <div id="all"></div>
      </main>
    );
  }
}

export default LiveExperience;