import { getUUIDToken } from "Util/Auth";

export const userToken = () => {
  var data = localStorage.getItem("customer") || null;
  let userData = data ? JSON.parse(data) : null;
  let userToken =
    userData && userData.data && userData.data.id
      ? `user-${userData.data.id}`
      : getUUIDToken()
      ? getUUIDToken()
      : null;
  return userToken;
};
