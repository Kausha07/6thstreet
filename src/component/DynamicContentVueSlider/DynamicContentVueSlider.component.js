import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import VueQuery from "../../query/Vue.query";
import DynamicContentVueProductSliderContainer from "../DynamicContentVueProductSlider";
import "./DynamicContentVueSlider.style";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
});

class DynamicContentVueSlider extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        label: PropTypes.string,
        link: PropTypes.string,
        plp_config: PropTypes.shape({}), // TODO: describe
      })
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isArabic: isArabic(),
    };
  }

  componentDidMount() {
    let a = this.props;
    this.getPdpWidgetsVueData();
  }

  getPdpWidgetsVueData = () => {
    const { gender } = this.props;
    const {
      USER_DATA: { deviceUuid },
    } = BrowserDatabase.getItem("MOE_DATA");
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: deviceUuid,
    };
    let type = this.props.type;
    const payload = VueQuery.buildQuery(type, query, {
      gender,
      userID,
    });
    fetchVueData(payload)
      .then((resp) => {
        this.setState({
          data: resp.data,
        });
      })
      .catch((err) => {
        console.log("pdp widget vue query catch", err);
      });
  };

  render() {
    const { isArabic } = this.state;
    return (
      <div block="VeuSliderWrapper" mods={{ isArabic }}>
        {this.state.data?.length > 0 && (
          <DynamicContentVueProductSliderContainer
            products={this.state.data}
            heading={this.props.layout.title}
            isHome={true}
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DynamicContentVueSlider);
