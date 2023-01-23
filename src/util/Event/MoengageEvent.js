import MoEngage from "react-moengage";

export const MOE_trackEvent = (name, { options }) => {
  if (MoEngage.moe) {
    Moengage.track_event(name, { options });
  }
};
export const MOE_AddFirstName = (firstName) => {
  if (MoEngage.moe) {
    Moengage.add_first_name(firstName);
  }
};

export const MOE_addLastName = (lastName) => {
  if (MoEngage.moe) {
    Moengage.add_last_name(lastName);
  }
};

export const MOE_addEmail = (email) => {
  if (MoEngage.moe) {
    Moengage.add_email(email);
  }
};

export const MOE_addMobile = (phone) => {
  if (MoEngage.moe) {
    Moengage.add_mobile(phone);
  }
};

export const MOE_AddUniqueID = (id) => {
  if (MoEngage.moe) {
    Moengage.add_unique_user_id(id);
  }
};

export const MOE_destroySession = () => {
  if (MoEngage.moe) {
    Moengage.destroy_session();
  }
};
