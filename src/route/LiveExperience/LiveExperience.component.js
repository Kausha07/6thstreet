import { PureComponent } from "react";
import Config from "./LiveExperience.config";
import ThirdPartyAPI from "Util/API/provider/ThirdPartyAPI";
// import {} from ''
import ContentWrapper from 'Component/ContentWrapper';
import './LiveExperience.style.scss';
import cartIcon from './icons/cart-icon.png';
import timerIcon from './icons/timer.png';
import playbtn from './icons/playbtn.png';

export class LiveExperience extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.broadcastId) {
      this.renderLiveParty();
    }
    this.renderUpcomingParty();
    this.renderArchivedParty();
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
    return content.map(this.renderUpcomingGridBlock);
  }
  renderSpckarchivedEvent() {
    //const content = this.props.archived;
    const content = this.props.upcoming;
    console.log(this.props.archived);
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
        <a block="eventPlayBtn"><img src={playbtn} alt="event-playbtn"/></a>
        <div block="eventInfo">
          <h3 block="eventTitle">{name}</h3>
          <a block="playButton">Button</a>
        </div>
      </div>
    )}
  };

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
        <a block="eventPlayBtn"><img src={playbtn} alt="event-playbtn"/></a>
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
          </ContentWrapper>
      </main>
    );
  }
}

export default LiveExperience;
