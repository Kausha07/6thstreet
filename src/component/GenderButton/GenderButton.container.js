import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { setGender } from "Store/AppState/AppState.action";
import PLPDispatcher from "Store/PLP/PLP.dispatcher";
import GenderButton from "./GenderButton.component";
import { getLocaleFromUrl } from "Util/Url/Url";
export const mapStateToProps = (state) => ({
  currentContentGender: state.AppState.gender,
});

export const mapDispatchToProps = (dispatch) => ({
  setGender: (gender) => dispatch(setGender(gender)),
  requestPLPWidgetData: () => PLPDispatcher.requestPLPWidgetData(dispatch),
});

export class GenderButtonContainer extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    setGender: PropTypes.func.isRequired,
    currentContentGender: PropTypes.string.isRequired,
    changeMenuGender: PropTypes.func,
    isCurrentGender: PropTypes.bool.isRequired,
    getNewActiveMenuGender: PropTypes.func.isRequired,
    handleUnsetStyle: PropTypes.func.isRequired,
    isUnsetStyle: PropTypes.bool.isRequired,
    gender: PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    onClick: () => { },
    changeMenuGender: () => { },
  };

  containerFunctions = {
    onGenderClick: this.onGenderClick.bind(this),
    onGenderEnter: this.onGenderEnter.bind(this),
    onGenderLeave: this.onGenderLeave.bind(this),
  };

  containerProps = () => {
    const {
      gender: { label, key },
      isCurrentGender,
      isUnsetStyle,
    } = this.props;

    return {
      label,
      urlKey: key,
      isCurrentGender,
      isUnsetStyle,
    };
  };

  onGenderClick() {
    const {
      onClick,
      setGender,
      requestPLPWidgetData,
      gender: { key },
    } = this.props;

    setGender(key);
    onClick(key);
    const locale = getLocaleFromUrl();
    if (locale) {
      requestPLPWidgetData();
    }
  }

  onGenderEnter() {
    const {
      gender: { key },
      changeMenuGender,
      getNewActiveMenuGender,
      handleUnsetStyle,
    } = this.props;

    getNewActiveMenuGender(key);
    changeMenuGender(key);
    handleUnsetStyle(true);
  }

  onGenderLeave() {
    const { handleUnsetStyle, changeMenuGender, currentContentGender } =
      this.props;
    changeMenuGender(currentContentGender);
    handleUnsetStyle(false);
  }

  render() {
    return (
      <GenderButton {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenderButtonContainer);
