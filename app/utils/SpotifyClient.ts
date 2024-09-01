import axios from 'axios';

class SpotifyClient {
  private accessToken: string | null;
  private refreshToken: string;
  private expiresAt: number;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getRequest(url: string) {
    // Check if token is expired or missing, refresh if needed
    if (!this.accessToken || this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    try {
      // Make the actual request to Spotify API
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error making Spotify request:', error);
      throw error;
    }
  }

  private isTokenExpired(): boolean {
    return Date.now() > this.expiresAt;
  }

  private async refreshAccessToken() {
    try {
      // Request a new access token using the refresh token
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: process.env.SPOTIFY_CLIENT_ID!,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Update the access token and expiration time
      this.accessToken = response.data.access_token;
      this.expiresAt = Date.now() + response.data.expires_in * 1000;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  // Method to get currently playing track
  getCurrentlyPlaying() {
    return this.getRequest('https://api.spotify.com/v1/me/player/currently-playing');
  }
}

export default SpotifyClient;