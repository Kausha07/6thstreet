import { PureComponent } from "react";
import Countdown from "react-countdown";
// import {} from ''
import ContentWrapper from 'Component/ContentWrapper';
import './LiveExperience.style.scss';
import cartIcon from './icons/cart-icon.png';
import timerIcon from './icons/timer.png';
import playbtn from './icons/player.svg';

export class LiveExperience extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: null
    };
  }

  componentDidMount() {
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
          <div block="liveNow">
          <p block="liveNow-text">LIVE NOW</p>
        </div>
        </div>
        <a block="eventPlayBtn" onClick={() => this.onClickPartyPlay(block.id)}><img src={playbtn} alt="event-playbtn"/></a>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
        </div>

      </div>
    )}
  };


  renderUpcomingGridBlock = (block, i) => {
    const { mainImageURI, squareImageURI, name, description, starts, products } = block;
    let d = new Date(starts);
    let s = "2021-06-12T09:30:00.000Z"
    if (mainImageURI) {
    return (
      <li block="spckItem">
        <div block="eventImage">
          <img src={mainImageURI} alt={name}  />
        </div>
        <p block="eventStart"><img src={timerIcon} alt="timerIcon" />
        <Countdown
          date={d}
          daysInHours="true"

          />,
        </p>
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
        <a block="eventPlayBtn"   onClick={() => this.onClickPartyPlay(block.id)} ><img src={playbtn} alt="event-playbtn" /></a>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
          <p block="eventDesc">{description}</p>
        </div>
      </li>
    )}
  };
  onClickPartyPlay = (id) => {
    let newId = id.toString();
    let ele = document.getElementsByTagName("button")
    for(let i = 0 ; i < ele.length; i++){
      // debugger
      if(ele[i].getAttribute("data-spck-id") === newId){
        ele[i].click();
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
          </ContentWrapper>
          <div id="all"></div>
      </main>
    );
  }
}

export default LiveExperience;
