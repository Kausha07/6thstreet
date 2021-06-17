import PropTypes from "prop-types";
import React from "react";
import { PureComponent } from "react";
import { connect } from 'react-redux';
import VueQuery from '../../query/Vue.query';
import BrowserDatabase from "Util/BrowserDatabase";
import { fetchVueData } from 'Util/API/endpoint/Vue/Vue.endpoint';
import DynamicContentVueProductSliderContainer from '../DynamicContentVueProductSlider';
import Link from "Component/Link";
import { formatCDNLink } from "Util/Url";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import "./DynamicContentVueSlider.style";



export const mapStateToProps = (state) => ({
  gender: state.AppState.gender
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
      data: []
    };
  }

  componentDidMount() {
      let a = this.props
      this.getPdpWidgetsVueData();
      // debugger
  }

  getPdpWidgetsVueData = () => {
    const { gender } = this.props;
    const { USER_DATA: { deviceUuid } } = BrowserDatabase.getItem("MOE_DATA");
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: deviceUuid,
  };
  let type = this.props.type
  const payload = VueQuery.buildQuery(type, query, {
    gender,
    userID
  });
  fetchVueData(payload).then((resp) => {
    this.setState({
        data:resp.data
      });

  })
  .catch((err) => {
    console.log("pdp widget vue query catch", err)
  });

  }




  render() {
    console.log(this.state.data.length)
    // debugger
    return (
    <div block="VeuSliderWrapper">
    { this.state.data.length > 0 &&
    <DynamicContentVueProductSliderContainer
      products={this.state.data}
      heading={this.props.layout.title}
      isHome={true}
    />
    }
    </div>
    );
  }
}

export default connect(mapStateToProps, null)(DynamicContentVueSlider);
