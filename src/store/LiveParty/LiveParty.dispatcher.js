import {
  setLivePartyData,
  setLivePartyLoading,
  setUpcomingPartyData,
  setUpcomingPartyLoading,
  setArchivedPartyData,
  setArchivedPartyLoading,
} from "./LiveParty.action";

import {
  getLiveParty,
  getUpcomingParty,
  getArchivedParty,
} from "Util/API/endpoint/LiveParty/LiveParty.endpoint";

export class LivePartyDispatcher {
  async requestLiveParty(payload, dispatch) {
    dispatch(setLivePartyLoading(true));

    const { broadcastId } = payload;

    try {
      const response = await getLiveParty({
        broadcastId,
      });
      dispatch(setLivePartyLoading(false));

      dispatch(setLivePartyData(response));
    } catch (e) {
      Logger.log(e);
      dispatch(setLivePartyLoading(false));
    }
  }

  async requestUpcomingParty(payload, dispatch) {
    dispatch(setUpcomingPartyLoading(true));

    const { storeId, isStaging } = payload;

    try {
      const response = await getUpcomingParty({
        storeId,
        isStaging,
      });
      dispatch(setUpcomingPartyLoading(false));

      dispatch(setUpcomingPartyData(response));
    } catch (e) {
      Logger.log(e);
      dispatch(setUpcomingPartyLoading(false));
    }
  }

  async requestArchivedParty(payload, dispatch) {
    dispatch(setArchivedPartyLoading(true));

    const { storeId, isStaging } = payload;

    try {
      const response = await getArchivedParty({
        storeId,
        isStaging,
      });
      dispatch(setArchivedPartyLoading(false));

      dispatch(setArchivedPartyData(response));
    } catch (e) {
      Logger.log(e);
      dispatch(setArchivedPartyLoading(false));
    }
  }
}
export default new LivePartyDispatcher();
