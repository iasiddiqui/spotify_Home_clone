
const Login = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  
    const scopes = [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "playlist-read-collaborative",
    ];
  
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(" "))}`;
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Spotify Playlist Dashboard</h1>
        <a
          href={authUrl}
          className="bg-green-500 px-6 py-3 rounded text-white hover:bg-green-600 transition"
        >
          Login with Spotify
        </a>
      </div>
    );
  };
  
  export default Login;
  