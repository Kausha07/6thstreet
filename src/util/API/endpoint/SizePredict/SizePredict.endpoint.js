import MobileAPI from "../../provider/MobileAPI";

export const fetchPredictedSize = (header) =>
  MobileAPI.get("/predictsize", header) || {};

