import MobileAPI from "../../provider/MobileAPI";

export const fetchVueData = (payload) =>
  MobileAPI.post("/vue/data", payload) || {};

export const fetchConsolidatedVueData = (payload) =>
  MobileAPI.post("/vue/sliders", payload) || {};
