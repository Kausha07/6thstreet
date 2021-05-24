import { PureComponent } from "react";
import Config from "./LiveExperience.config";
import ThirdPartyAPI from "Util/API/provider/ThirdPartyAPI";
// import {} from ''

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

  render() {
    return (
      <div>
        <div block="Container">
          <div id="single"></div>
          <div>
            <h1 block="Container" elem="Title">
              {__("COMING NEXT")}
            </h1>
            <div id="live"></div>
          </div>
          <div>
            <h1 block="Container" elem="Title">
              {__("RECENTLY PLAYED")}
            </h1>
            <div id="archived"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default LiveExperience;
