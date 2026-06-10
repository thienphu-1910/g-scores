import { api } from "./api";

export const searchService = {
  searchScores: async (regisNumber) => {
    try {
      const scores = await api.get(`/search-scores/${regisNumber}`);
      return scores;
    } catch (e) {
      console.log(e);
    }
  }
}