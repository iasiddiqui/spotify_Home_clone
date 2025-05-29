// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
// import Dashboard from "./pages/Dashboard";
// import Callback from "./pages/Callback";

// function App() {
//   const [token, setToken] = useState(() => window.localStorage.getItem("spotify_token") || "");
//   const [user, setUser] = useState(null);
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playlistPreviews, setPlaylistPreviews] = useState({}); // { playlistId: previewUrl }

//   useEffect(() => {
//     if (!token) return;

//     setLoading(true);
//     setError(null);

//     const fetchUser = fetch("https://api.spotify.com/v1/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => {
//       if (!res.ok) throw new Error("Failed to fetch user profile");
//       return res.json();
//     });

//     const fetchPlaylists = fetch("https://api.spotify.com/v1/me/playlists", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => {
//       if (!res.ok) throw new Error("Failed to fetch playlists");
//       return res.json();
//     });

//     Promise.all([fetchUser, fetchPlaylists])
//       .then(async ([userData, playlistsData]) => {
//         setUser(userData);
//         setPlaylists(playlistsData.items);

//         // Fetch first track preview for each playlist
//         const previews = {};
//         await Promise.all(
//           playlistsData.items.map(async (playlist) => {
//             try {
//               const res = await fetch(playlist.tracks.href, {
//                 headers: { Authorization: `Bearer ${token}` },
//               });
//               if (!res.ok) throw new Error("Failed to fetch playlist tracks");
//               const data = await res.json();
//               const preview = data.items?.[0]?.track?.preview_url || null;
//               previews[playlist.id] = preview;
//             } catch {
//               previews[playlist.id] = null;
//             }
//           })
//         );
//         setPlaylistPreviews(previews);
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [token]);

//   const logout = () => {
//     setToken("");
//     setUser(null);
//     setPlaylists([]);
//     setPlaylistPreviews({});
//     setCurrentTrackUrl(null);
//     setIsPlaying(false);
//     window.localStorage.removeItem("spotify_token");
//   };

//   const playPreview = (previewUrl) => {
//     if (currentTrackUrl === previewUrl) {
//       setIsPlaying(!isPlaying);
//     } else {
//       setCurrentTrackUrl(previewUrl);
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-900 text-white p-6">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               !token ? (
//                 <Login />
//               ) : (
//                 <Dashboard
//                   user={user}
//                   playlists={playlists}
//                   playlistPreviews={playlistPreviews} // pass previews here
//                   loading={loading}
//                   error={error}
//                   logout={logout}
//                   playPreview={playPreview}
//                   currentTrackUrl={currentTrackUrl}
//                   isPlaying={isPlaying}
//                   setIsPlaying={setIsPlaying}
//                 />
//               )
//             }
//           />
//           <Route path="/callback" element={<Callback setToken={setToken} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-library-read",
].join(" ");

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let tokenFromUrl = "";
    if (hash) {
      tokenFromUrl = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        ?.split("=")[1];
      window.location.hash = "";
    }

    const localToken = localStorage.getItem("spotify_token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("spotify_token", tokenFromUrl);
    } else if (localToken) {
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;

    setLoading(true);
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch playlists");
        return res.json();
      })
      .then((data) => setPlaylists(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, user]);

  const logout = () => {
    setToken("");
    setUser(null);
    setPlaylists([]);
    localStorage.removeItem("spotify_token");
  };

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}&response_type=${RESPONSE_TYPE}&show_dialog=true`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-700 text-white p-4 font-sans">
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

      {error && <div className="bg-red-700 p-3 mb-6 rounded">{error}</div>}

      {!token && <p>Please login to continue.</p>}

      {loading && <p>Loading...</p>}

      {token && user && (
        <div>
          <div className="flex items-center mb-8 space-x-4">
            {user.images?.[0]?.url && (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <h2 className="text-2xl font-semibold">Welcome, {user.display_name}</h2>
          </div>

          <h3 className="text-xl font-semibold mb-4">Your Playlists</h3>

          {playlists.length === 0 && <p>No playlists found.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-black bg-opacity-50 p-4 rounded-lg hover:bg-opacity-75 transition"
              >
                {playlist.images?.[0]?.url ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 rounded-md mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h4 className="font-semibold text-lg">{playlist.name}</h4>
                <p className="text-sm text-gray-300">
                  {playlist.tracks.total} tracks
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

