import React, { useEffect, useState } from "react";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-library-read"
].join(" ");

const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}&response_type=${RESPONSE_TYPE}&show_dialog=true`;

function Home() {
  const [token, setToken] = useState(localStorage.getItem("spotify_token") || "");
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setPlaylists(data.items || []));
  }, [token]);

  const logout = () => {
    localStorage.removeItem("spotify_token");
    setToken("");
    setUser(null);
    setPlaylists([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-700 text-white p-4 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Spotify Homepage Clone</h1>
        {token ? (
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <a
            href={loginUrl}
            className="bg-black px-6 py-3 rounded text-green-400 font-semibold hover:text-green-200 transition"
          >
            Login with Spotify
          </a>
        )}
      </header>

      {!token ? (
        <p>Please login to see your playlists.</p>
      ) : (
        <div>
          {user && (
            <div className="mb-6">
              <h2 className="text-xl font-bold">Welcome, {user.display_name}</h2>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-4">Your Playlists</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-black bg-opacity-50 p-4 rounded hover:bg-opacity-70 transition"
              >
                {playlist.images?.[0]?.url ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 rounded flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
                <h4 className="text-lg font-semibold">{playlist.name}</h4>
                <p className="text-sm">{playlist.tracks.total} tracks</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
