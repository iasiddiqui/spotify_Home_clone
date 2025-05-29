// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Callback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const hash = window.location.hash;
//     if (!hash) {
//       console.error("No hash in callback URL");
//       // Redirect or show error
//       navigate('/login'); // or wherever you want to go
//       return;
//     }

//     const params = new URLSearchParams(hash.substring(1)); // remove '#'
//     const accessToken = params.get('access_token');

//     if (!accessToken) {
//       console.error("No token found in hash");
//       // Redirect or show error
//       navigate('/login');
//       return;
//     }

//     // Save token (example: localStorage)
//     localStorage.setItem('access_token', accessToken);

//     // Clear the hash from URL for cleanliness
//     window.history.replaceState(null, null, window.location.pathname);

//     // Redirect to your app's main page after login
//     navigate('/');
//   }, [navigate]);

//   return <div>Logging you in...</div>;
// };

// export default Callback;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

function Callback({ setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const storedState = localStorage.getItem("pkce_state");
    const codeVerifier = localStorage.getItem("pkce_code_verifier");

    if (!code || !state || state !== storedState) {
      alert("Authorization failed. Please try again.");
      navigate("/");
      return;
    }

    // Clean up state and code verifier from localStorage
    localStorage.removeItem("pkce_state");

    // Exchange authorization code for access token
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token exchange failed");
        return res.json();
      })
      .then((data) => {
        setToken(data.access_token);
        localStorage.setItem("spotify_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
        navigate("/");
      });
  }, [navigate, setToken]);

  return <p>Loading authorization...</p>;
}

export default Callback;
