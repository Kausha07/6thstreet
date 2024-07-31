import React, { useState } from "react";
import { connect } from "react-redux";
import Field from "Component/Field";
import "./AddressTypeSelection.style";

export const mapStateToProps = (state) => ({
  mailing_address_type: state.AppConfig.mailing_address_type,
});

export const AddressTypeSelection = (props) => {
  const {
    mailing_address_type,
    address,
    mailing_address_type_props,
    isArabic,
  } = props;

  const [selectedAddressType, setSelectedAddressType] = useState(
    address?.mailing_address_type || "37303"
  );

  const handleAddressTypeChange = (value) => {
    setSelectedAddressType(value);
    mailing_address_type_props?.onMailingAddressTypeChange(value);
  };

  const render = () => {
    return (
      <div block="AddressTypeSelection">
        <div block="MyAccountAddressFieldForm">
          {mailing_address_type?.map((type) => (
            <Field
              key={type?.value}
              type="radio"
              id={type.value}
              label={isArabic() ? type?.label?.ar : type?.label?.en}
              name="addressType"
              value={type?.value}
              checked={
                selectedAddressType === type?.value ||
                type?.value === mailing_address_type_props?.value
              }
              onClick={() => handleAddressTypeChange(type.value)}
            />
          ))}
        </div>
      </div>
    );
  };

  return render();
};

export default connect(mapStateToProps, null)(AddressTypeSelection);
