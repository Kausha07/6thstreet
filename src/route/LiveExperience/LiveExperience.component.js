import { PureComponent } from "react";
import Config from "./LiveExperience.config";
import ThirdPartyAPI from "Util/API/provider/ThirdPartyAPI";
// import {} from ''
import ContentWrapper from 'Component/ContentWrapper';
import BrowserDatabase from "Util/BrowserDatabase";
import './LiveExperience.style.scss';
import cartIcon from './icons/cart-icon.png';
import timerIcon from './icons/timer.png';
import playbtn from './icons/playbtn.png';
// import * as spocy from './Party';

export class LiveExperience extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      hideOnBroadcast: false
    };
  }


  ITEM_TYPE = {
    upcoming: "upcoming",
    archived: "archived",
  };

  componentDidMount() {
    //   const script = document.createElement("script");
    //   script.src = "https://d1tinli1tzriht.cloudfront.net/party.js";
    //   script.async = true;
    //   document.body.appendChild(script);
    //   script.onload = () => {
    //     // script has loaded, you can now use it safely
    //     // alert('thank me later')
    //     // ... do something with the newly loaded script
    //     // let a = window.getScheduleToken('_spckUserToken');
    //     debugger
    // }
    let _spckUserToken;
    _spckUserToken = `customer_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    let b = window.localStorage.getItem("_spckUserToken")

    if(!window.localStorage.getItem("_spckUserToken")){
      window.localStorage.setItem("_spckUserToken", _spckUserToken )
    }

    // debugger

    if (this.props.broadcastId) {
      this.renderLiveParty();
    }
    else{
      this.renderUpcomingParty();
      this.renderArchivedParty();
    }

  }
  componentDidUpdate() {
    if (this.props.broadcastId) {
      this.renderLiveParty();
    }
  }

  playHandler = async (type, id) => {
    const cutomer_id = window.localStorage.getItem("_spckUserToken");
    const url = `https://d14xmqtgwld57m.cloudfront.net/${type}/${id}?customColor=%23000000&partyIframeId=68qyVT546HtifHOyXhjWg&customerId=${cutomer_id}"`;
    // try {
    //   const resp = await ThirdPartyAPI.put("https://api.spockee.io/t", {
    //     action: "openSP",
    //     customerId: "customer_6ewsan0xu40vekso",
    //     data: { id: 3303 },
    //     navigator: {},
    //     source: "shoppingParty",
    //     storeId: "13207961",
    //   });
    // } catch (error) {}
    // debugger
    this.setState({ url });
  };

  renderLiveParty = async () => {};
  renderUpcomingParty = () => {};
  renderArchivedParty = () => {};


  renderSpckLiveEvent() {
    const content = this.props.live;
    return this.renderLiveBlock(content);
  }
  renderSpckUpcomingEvent() {
    const content = this.props.upcoming;
    console.log(this.props.upcoming);
    return content.map(this.renderUpcomingGridBlock);
  }
  renderSpckarchivedEvent() {
    //const content = this.props.archived;
    const content = this.props.archived;
    // debugger
    return content.map(this.renderArchivedGridBlock);
  }

  renderLiveBlock = (block, i) => {
    const { mainImageURI, squareImageURI, name, description, starts } = block;
    if (mainImageURI) {
    return (
      <div block="spck-live-event">
        <div block="mainImage">
          <img src={mainImageURI} alt={name} />
        </div>
        <a block="eventPlayBtn" onClick={() => this.playHandler(this.ITEM_TYPE.upcoming, block.id)}><img src={playbtn} alt="event-playbtn"/></a>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
        </div>
      </div>
    )}
  };

  hidePopup = () => {
    this.setState({ url: null });
  };
  renderPopup = () => {
    // debugger
    const { url } = this.state;
    const svg = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 -1 26 26"
      >
        <path
          d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
        />
      </svg>
    );
    if (!url) {
      return null;
    }
    return (
      <div className="spck-popup-iframe">
        <button className="spkBtn" onClick={this.hidePopup}>
          {svg}
        </button>
        <iframe
          contentDidMount={this.contentMounted}
          id="68qyVT546HtifHOyXhjWg"
          className="spck-popup-iframe"
          src={url}
        ></iframe>
      </div>
    );
  }

  renderUpcomingGridBlock = (block, i) => {
    const { mainImageURI, squareImageURI, name, description, starts, products } = block;
    let d = new Date(starts);
    if (mainImageURI) {
    return (

      <li block="spckItem">
        <div block="eventImage">
          <img src={mainImageURI} alt={name}  />
        </div>
        <p block="eventStart"><img src={timerIcon} alt="timerIcon" /> {d.getUTCHours()}: {d.getUTCMinutes()} : {d.getUTCSeconds()}</p>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
          <p block="eventDesc">{description}</p>
        </div>
      </li>
    )}
  };
  renderArchivedGridBlock = (block, i) => {
    const { mainImageURI, name, description, products } = block;
    if (mainImageURI) {
    return (
      <li block="spckItem">
        <div block="eventImage">
          <img src={mainImageURI} alt={name}  />
        </div>
        <p block="eventProduct"><img src={cartIcon} alt="cartIcon"/> {products.length}</p>
        <a block="eventPlayBtn" onClick={() => this.playHandler(this.ITEM_TYPE.archived, block.id)}><img src={playbtn} alt="event-playbtn"/></a>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
          <p block="eventDesc">{description}</p>
        </div>
      </li>
    )}
  };

  render() {
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


          <div block="upComing-Grid">
            <h3 block="sectionTitle">{__("COMING NEXT")}</h3>
            <ul block="spckItems">
              {this.renderSpckUpcomingEvent()}
            </ul>
          </div>

          <div block="archived-Grid">
            <h3 block="sectionTitle">{__("RECENTLY PLAYED")}</h3>
            <ul block="spckItems">
              {this.renderSpckarchivedEvent()}
            </ul>
          </div>
          {this.renderPopup()}
          </ContentWrapper>
      </main>
    );
  }
}

export default LiveExperience;
