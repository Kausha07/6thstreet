import React, { useState } from "react";
import Field from "Component/Field";
import "./MyAccountAddressNationalityFieldFrom.style.scss";
import { connect } from "react-redux";
export const mapStateToProps = (state) => ({
  is_nationality_mandatory: state.AppConfig.is_nationality_mandatory,
});

const MyAccountAddressNationalityFieldFrom = ({ isArabic: isArabicfun }) => {
  const [nationality, setNationality] = useState("");
  const [isNationalityClick, setNationalityClick] = useState(true);
  const [validationError, setValidationError] = useState(false);
  const handleChange = (value) => {
    if (isNationalityClick && /^\d{0,12}$/.test(value)) {
      setNationality(value);
      setValidationError(false);
    } else if (!isNationalityClick && !/^[a-zA-Z0-9]*$/.test(value)) {
      setNationality(value);
      setValidationError(false);
    } else {
      setValidationError(true);
    }
  };
  const hanldeRadioBtnClick = (nationalityCard) => {
    if (nationalityCard !== "nationalityId") {
      setNationalityClick(false);
    } else {
      setNationalityClick(true);
    }
  };
  const isArabic = isArabicfun();
  console.log("test kiran --->", "checking ===>", nationality);
  return (
    <div block="nationality-field-container">
      <fieldset block="MyAccountAddressForm" key="nationality-radio-buttons">
        <div
          block="MyAccountCustomerForm"
          elem="Nationality-Radio"
          mods={{ isArabic }}
        >
          <Field
            type="radio"
            id="nation-id-number"
            label={__("National ID number")}
            name="nationalId"
            value="1"
            onClick={() => hanldeRadioBtnClick("nationalityId")}
            checked={isNationalityClick}
          />
          <Field
            type="radio"
            id="passport-number"
            label={__("Passport Number")}
            name="passportNumber"
            value="2"
            checked={!isNationalityClick}
            onClick={() => hanldeRadioBtnClick("passport")}
            // defaultChecked={false}
          />
        </div>
        <div block="nationality-id-input-field">
          <Field
            type="text"
            name="nationality-number"
            placeholder={__("Enter the National/Passport number")}
            block="nationality-input-text-box"
            className={validationError ? "show-validation-message" : ""}
            value={nationality}
            maxLength={isNationalityClick ? 12 : 9}
            pattern={isNationalityClick ? "[0-9]*" : "[a-zA-Z0-9]*"}
            validation={["notEmpty", "onlyCharacters"]}
            onChange={handleChange} // Adding onChange event here
          />
          {validationError ? (
            <div block="custom-clearance-text" elem="Message">
              {__("Please provide national ID number for custom clearance")}
            </div>
          ) : (
            ""
          )}
        </div>
      </fieldset>
    </div>
  );
};

export default connect(
  mapStateToProps,
  null
)(MyAccountAddressNationalityFieldFrom);
