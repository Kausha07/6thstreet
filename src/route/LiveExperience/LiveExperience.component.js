import { PureComponent } from "react";
import Config from "./LiveExperience.config";
import { getQueryParam } from "Util/Url";

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

  renderLiveParty = () => {
    const isStaging =
      getQueryParam("isStaging", location) === "true" ? true : false;
    const spck = {
      storeId: Config.storeId,
      storeType: "sixthstreet",
      customColor: "#000000",
      containerId: "single",
      displayType: "one",
      broadcastId: this.props.broadcastId,
      staging: process.env.REACT_APP_SPOCKEE_STAGING,
    };

    const el = document.createElement("script");

    el.setAttribute("src", "https://party.spockee.io/builder/" + spck.storeId);

    el.setAttribute("data-spck", JSON.stringify(spck));

    document.body.appendChild(el);
    setTimeout(() => {
      import("./LiveExperience.style");
    }, 2000);
  };
  renderUpcomingParty = () => {
    const isStaging =
      getQueryParam("isStaging", location) === "true" ? true : false;
    const spck = {
      storeId: Config.storeId,

      storeType: "sixthstreet",

      customColor: "#000000",

      containerId: "live",

      displayType: "upcoming",

      staging: process.env.REACT_APP_SPOCKEE_STAGING,
    };

    const el = document.createElement("script");

    el.setAttribute("src", "https://party.spockee.io/builder/" + spck.storeId);

    el.setAttribute("data-spck", JSON.stringify(spck));

    document.body.appendChild(el);
    setTimeout(() => {
      import("./LiveExperience.style");
    }, 2000);
  };

  renderArchivedParty = () => {
    const isStaging =
      getQueryParam("isStaging", location) === "true" ? true : false;
    const spck = {
      storeId: Config.storeId,

      storeType: "sixthstreet",

      customColor: "#000000",

      containerId: "archived",

      displayType: "vod",

      staging: process.env.REACT_APP_SPOCKEE_STAGING,
    };

    const el = document.createElement("script");

    el.setAttribute("src", "https://party.spockee.io/builder/" + spck.storeId);

    el.setAttribute("data-spck", JSON.stringify(spck));

    document.body.appendChild(el);
    setTimeout(() => {
      import("./LiveExperience.style");
    }, 2000);
  };

  render() {
    return (
      <div>
        <div block="Container">
          <div id="single"></div>
          {!this.props.broadcastId && (
            <div>
              <h1 block="Container" elem="Title">
                {__("COMING NEXT")}
              </h1>
              <div id="live"></div>
            </div>
          )}
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
