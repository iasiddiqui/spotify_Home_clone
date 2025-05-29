const Header = ({ user, onLogout }) => (
    <header className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        {user?.images?.[0]?.url && (
          <img
            src={user.images[0].url}
            alt={user.display_name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <h2 className="text-xl font-semibold">Welcome, {user?.display_name}</h2>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
  );
  
  export default Header;
  