import MoEngage from "react-moengage";
import { isSignedIn } from "Util/Auth";

export const MOE_trackEvent = (name, options) => {
  const attributes =
    options?.isLoggedIn == undefined
      ? { ...options, isLoggedIn: isSignedIn() }
      : options;

  if (MoEngage.moe && window.Moengage) {
    Moengage.track_event(name, attributes);
  }
};
export const MOE_AddFirstName = (firstName) => {
  if (MoEngage.moe && window.Moengage) {
    Moengage.add_first_name(firstName);
  }
};

export const MOE_addLastName = (lastName) => {
  if (MoEngage.moe && window.Moengage) {
    Moengage.add_last_name(lastName);
  }
};

export const MOE_addEmail = (email) => {
  if (MoEngage.moe && window.Moengage) {
    Moengage.add_email(email);
  }
};

export const MOE_addMobile = (phone) => {
  if (MoEngage.moe && window.Moengage) {
    Moengage.add_mobile(phone);
  }
};

export const MOE_AddUniqueID = (id) => {
  if (MoEngage.moe && window.Moengage) {
    Moengage.add_unique_user_id(id);
  }
};

export const MOE_destroySession = () => {
  if (MoEngage.moe && window.Moengage) {
    Moengage.destroy_session();
  }
};
