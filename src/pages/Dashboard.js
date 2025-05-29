import Header from "../components/Header";
import PlaylistCard from "../components/PlaylistCard";
import AudioPlayer from "../components/AudioPlayer";

const Dashboard = ({
  user,
  playlists,
  playlistPreviews,
  loading,
  error,
  logout,
  playPreview,
  currentTrackUrl,
  isPlaying,
  setIsPlaying,
}) => (
  <>
    <Header user={user} onLogout={logout} />

    {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}

    <section>
      <h3 className="text-2xl mb-4">Your Playlists</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.length === 0 && <p>No playlists found.</p>}
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            playPreview={playPreview}
            currentTrackUrl={currentTrackUrl}
            isPlaying={isPlaying}
            previewUrl={playlistPreviews[playlist.id]} // pass preview here
          />
        ))}
      </div>
    </section>

    <AudioPlayer currentTrackUrl={currentTrackUrl} setIsPlaying={setIsPlaying} />
  </>
);

export default Dashboard;
