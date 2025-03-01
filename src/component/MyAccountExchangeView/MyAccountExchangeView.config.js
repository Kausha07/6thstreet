export const STATUS_PENDING = 'Pending';

export const STATUS_DENIED = 'Denied';

export const STATUS_TITLE_MAP = {
    [STATUS_PENDING]: __('Pending'),
    [STATUS_DENIED]: __('Denied')
};

export const STATUS_CREATED = "pickup_pending";
export const STATUS_TRANSIT = "out_for_pickup";
export const STATUS_DELIVERED = "pickedup";


export const STATUS_HIH_SHIPPED = "shipped";
export const STATUS_OUT_FOR_EXCHANGE = "out_for_exchange";
export const STATUS_EXCHANGED = "exchanged";

export const STATUS_DISPATCHED = ["created", "shipped", "pickup_pending"]; 
export const STATUS_IN_TRANSIT = ["in_transit", "out_for_exchange", "out_for_pickup"];
export const DELIVERY_SUCCESSFUL = ["exchanged", "pickedup"];

  
  export const STATUS_LABEL_MAP_NORMAL_EXCHANGE = {
    [STATUS_CREATED]: __("Created"),
    [STATUS_TRANSIT]: __("Out for Pickup"),
    [STATUS_DELIVERED]: __("Picked up"),
  };


  export const STATUS_LABEL_MAP_DOORSTEP_EXCHANGE = {
    [STATUS_HIH_SHIPPED]: __("Shipped"),
    [STATUS_OUT_FOR_EXCHANGE]: __("Out for Exchange"),
    [STATUS_EXCHANGED]: __("Exchanged"),
  };

  export const NORMAL_EX_DELIVERY_MESSAGE = __("Our courier partner executive will pick up the item first, then the exchange item will be delivered in %s days");
  export const DOORSTEP_EX_DELIVERY_MESSAGE = __("Keep your return items ready, our courier partner executive will come and pick up the item and then deliver the exchange item at your doorstep");

  export const NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE = __("We picked up the item, the exchange item will be delivered in %s days");
  export const INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE = __("We picked up the item. Since the exchange item is an international shipment, it will be delivered in %s days");
  export const NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE = __("Our courier partner executive will first pick up the item. Since the exchange item is an international shipment, it will be delivered in %s days");
 
  export const NORMAL_EX_DELIVERY_MESSAGE_EDD_DISABLED = __("Our courier partner executive will pick up the item first, then the exchange item will be delivered shortly");
  export const NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED = __("We picked up the item, the exchange item will be delivered shortly");
  export const INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED = __("We picked up the item. Since the exchange item is an international shipment, it will be delivered shortly");
  export const NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE_EDD_DISABLED = __("Our courier partner executive will first pick up the item. Since the exchange item is an international shipment, it will be delivered shortly");
  