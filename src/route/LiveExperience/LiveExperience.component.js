import { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import Config from "./LiveExperience.config";
import ThirdPartyAPI from "Util/API/provider/ThirdPartyAPI";
import { nanoid } from 'nanoid'
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
      hideOnBroadcast: false,
      iframeId: nanoid()
    };
  }


  ITEM_TYPE = {
    upcoming: "upcoming",
    archived: "archived",
  };

  componentDidMount() {
      // const script = document.createElement("script");
      // script.src = "./Party.js";
      // script.async = true;
      // document.body.appendChild(script);
    //   script.onload = () => {
    //     // script has loaded, you can now use it safely
    //     // alert('thank me later')
    //     // ... do something with the newly loaded script
    //     // let a = window.getScheduleToken('_spckUserToken');
    //     debugger
    // }
    (function() {
      var spck = {
           storeId: "13207961",
           storeType: "sixthstreet",
           customColor:'#000000',
           containerId : 'all',
           displayType:'all',
           staging: true
       };
       var el = document.createElement('script');
       el.setAttribute('src', 'https://party.spockee.io/builder/' + spck.storeId);
       el.setAttribute('data-spck', JSON.stringify(spck));
       document.body.appendChild(el);
   })();

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
    // debugger
    const cutomer_id = window.localStorage.getItem("_spckUserToken");
    let iframeId = nanoid();
    const url = `https://d14xmqtgwld57m.cloudfront.net/${type}/${id}?customColor=%23000000&partyIframeId=${this.state.iframeId}&customerId=${cutomer_id}"`;
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
    // return
    return content.map(this.renderUpcomingGridBlock);
  }
  renderSpckarchivedEvent() {
    //const content = this.props.archived;
    const content = this.props.upcoming;
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
          <div block="liveNow">
          <p block="liveNow-text">LIVE NOW</p>
        </div>
        </div>
        <a block="eventPlayBtn" onClick={() => this.onClickButton(block.id)}><img src={playbtn} alt="event-playbtn"/></a>
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
    const { url } = this.state;
    // debugger
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
      <div className="spck-popup-iframe" >
        <button className="spkBtn" onClick={this.hidePopup} >
          {svg}
        </button>
        <iframe
          contentDidMount={this.contentMounted}
          id={this.state.iframeId}
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
        <a block="eventPlayBtn"   onClick={() => this.onClickButton(block.id)}name={`${this.state.iframeId}-watch-button`} ><img src={playbtn} alt="event-playbtn" /></a>

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
        <a block="eventPlayBtn"   onClick={() => this.onClickButton(block.id)}name={`${this.state.iframeId}-watch-button`} ><img src={playbtn} alt="event-playbtn" /></a>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
          <p block="eventDesc">{description}</p>
        </div>
      </li>
    )}
  };
  onClickButton = (id) => {
    let newId = id.toString();
    let a = document.getElementsByTagName("button")
    for(let i = 0 ; i < a.length; i++){
      console.log(a[i].getAttribute("data-spck-id"))
      // debugger
      if(a[i].getAttribute("data-spck-id") === newId){
        a[i].click();
      }
    }

  }


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
            <div id="live"></div>
            <ul block="spckItems">
              {this.renderSpckUpcomingEvent()}
            </ul>

          </div>

          <div block="archived-Grid">
            <h3 block="sectionTitle">{__("RECENTLY PLAYED")}</h3>
            <div id="archived"></div>
            <ul block="spckItems">
              {this.renderSpckarchivedEvent()}
            </ul>
          </div>
          {this.renderPopup()}
          </ContentWrapper>
          <div id="all"></div>
      </main>
    );
  }
}

export default LiveExperience;
