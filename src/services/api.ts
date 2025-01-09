import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export interface RecommendationResponse {
  eligible_scheme_ids: string[];
}

export const SchemeAPI = {
  getRecommendations: async (email: string): Promise<RecommendationResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/get_recommendations`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to get recommendations');
      }
      throw error;
    }
  },
};