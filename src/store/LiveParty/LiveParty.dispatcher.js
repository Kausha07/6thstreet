import {
  setLivePartyData,
  setLivePartyLoading,
  setUpcomingPartyData,
  setUpcomingPartyLoading,
  setArchivedPartyData,
  setArchivedPartyLoading,
} from "./LiveParty.action";

import {getPartyInfo
} from "Util/API/endpoint/LiveParty/LiveParty.endpoint";

export class LivePartyDispatcher {
  async requestLiveParty(payload, dispatch) {
    dispatch(setLivePartyLoading(true));

    const { storeId } = payload;

    try {
      const response = await getPartyInfo({
        storeId,
      });
      dispatch(setLivePartyLoading(false));
      dispatch(setLivePartyData(response.playlists[2].shows[0]));
    } catch (e) {
      // Logger.log(e);
      dispatch(setLivePartyLoading(false));
    }
  }

  async requestUpcomingParty(payload, dispatch) {
    dispatch(setUpcomingPartyLoading(true));

    const { storeId, isStaging } = payload;

    try {
      const response = await getPartyInfo({
        storeId,
        isStaging,
      });
      dispatch(setUpcomingPartyLoading(false));

      dispatch(setUpcomingPartyData(response.playlists[0].shows));
    } catch (e) {
      // Logger.log(e);
      dispatch(setUpcomingPartyLoading(false));
    }
  }

  async requestArchivedParty(payload, dispatch) {
    dispatch(setArchivedPartyLoading(true));

    const { storeId, isStaging } = payload;

    try {
      const response = await getPartyInfo({
        storeId,
        isStaging,
      });
      dispatch(setArchivedPartyLoading(false));

      dispatch(setArchivedPartyData(response.playlists[1].shows));
    } catch (e) {
      // Logger.log(e);
      dispatch(setArchivedPartyLoading(false));
    }
  }
}
export default new LivePartyDispatcher();
