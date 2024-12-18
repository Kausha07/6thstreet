export const getSelectedAddress = (selectedAddressId = 0, addresses = []) => {
  if (selectedAddressId === 0 || addresses.length === 0) {
    return {}; // change this to null after guest user flow implemented.
  }

  const selectedAddress = addresses.find(
    (address) => address?.id === selectedAddressId
  );
  return selectedAddress || {};
};
