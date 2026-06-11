import { api } from "./api";

export const searchService = {
  searchScores: async (regisNumber) => {
    try {
      const response = await api.get(`/search-scores/${regisNumber}`);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
}