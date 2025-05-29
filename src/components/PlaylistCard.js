// import { useEffect, useState } from "react";

// const PlaylistCard = ({ playlist, playPreview, currentTrackUrl, isPlaying }) => {
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loadingPreview, setLoadingPreview] = useState(false);

//   useEffect(() => {
//     setLoadingPreview(true);
//     fetch(playlist.tracks.href, {
//       headers: {
//         Authorization: `Bearer ${window.localStorage.getItem("spotify_token")}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         const preview = data.items?.[0]?.track?.preview_url;
//         setPreviewUrl(preview);
//       })
//       .catch(() => setPreviewUrl(null))
//       .finally(() => setLoadingPreview(false));
//   }, [playlist.tracks.href]);

//   return (
//     <div
//       className="bg-gray-800 rounded p-4 hover:bg-gray-700 cursor-pointer transition"
//       onClick={() => previewUrl && playPreview(previewUrl)}
//     >
//       {playlist.images[0]?.url && (
//         <img
//           src={playlist.images[0].url}
//           alt={playlist.name}
//           className="w-full h-40 object-cover rounded mb-2"
//         />
//       )}
//       <h4 className="font-semibold">{playlist.name}</h4>
//       <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
//       {loadingPreview && <p className="text-gray-500 text-xs">Loading preview...</p>}
//       {!loadingPreview && !previewUrl && (
//         <p className="text-gray-500 text-xs">No preview available</p>
//       )}
//       {previewUrl && currentTrackUrl === previewUrl && isPlaying && (
//         <p className="text-green-400 text-xs">Playing ▶️</p>
//       )}
//     </div>
//   );
// };

// export default PlaylistCard;


const PlaylistCard = ({ playlist, playPreview, currentTrackUrl, isPlaying, previewUrl }) => {
    return (
      <div
        className="bg-gray-800 rounded p-4 hover:bg-gray-700 cursor-pointer transition"
        onClick={() => previewUrl && playPreview(previewUrl)}
      >
        {playlist.images[0]?.url && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-full h-40 object-cover rounded mb-2"
          />
        )}
        <h4 className="font-semibold">{playlist.name}</h4>
        <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
  
        {!previewUrl && (
          <p className="text-gray-500 text-xs">No preview available</p>
        )}
        {previewUrl && currentTrackUrl === previewUrl && isPlaying && (
          <p className="text-green-400 text-xs">Playing ▶️</p>
        )}
      </div>
    );
  };
  
  export default PlaylistCard;
  
