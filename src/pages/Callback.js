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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const token = hash
      .substring(1)
      .split("&")
      .find((el) => el.startsWith("access_token"))
      ?.split("=")[1];

    if (token) {
      localStorage.setItem("spotify_token", token);
      navigate("/");
    }
  }, [navigate]);

  return <p className="text-white p-8">Processing login...</p>;
};

export default Callback;

