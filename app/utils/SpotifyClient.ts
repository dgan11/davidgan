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
    if (!this.accessToken || this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    try {
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

      this.accessToken = response.data.access_token;
      this.expiresAt = Date.now() + response.data.expires_in * 1000;
      
      // Here, you might want to save the new access token to your database
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  getCurrentlyPlaying() {
    return this.getRequest('https://api.spotify.com/v1/me/player/currently-playing');
  }
}

export default SpotifyClient;