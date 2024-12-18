import { userToken } from "Util/User/userToken";
export default async function getSuggestions(
  { query = "", limit = 5 },
  options = {}
) {
  const { index } = options;
  try {
    const res = await index.search(query, {
      hitsPerPage: limit,
      clickAnalytics: true,
      userToken: userToken(),
      getRankingInfo: true,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
}
