import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lang } from '../../lang.jsx';
export default function EditPlaylist() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playlist } = location.state || {};
  const [playlistName, setPlaylistName] = useState(playlist?.playlist_name || '');
  const [playlistUrl, setPlaylistUrl] = useState(playlist?.url || '');
  const [isProtected, setIsProtected] = useState(playlist?.isProtected || false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const selectedLanguage = localStorage.getItem("lang") || 'en';
  const langValue = Lang[selectedLanguage];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (isProtected && !password) {
      setError('Password is required for protected playlists');
      return;
    }

    try {
      const response = await fetch(`https://shplayer.onrender.com/playList/update/${playlist._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `shM0${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          name: playlistName,
          url: playlistUrl,
          isProtected,
          ...(isProtected && { password }),
        }),
      });

      if (response.ok) {
        navigate('/manageplaylist');
      } else {
        const result = await response.json();
        setError(result.message || langValue['EditErrorMessageOne']);
      }
    } catch (error) {
      console.error(langValue["EditErrorMessageTwo"], error);
      setError(langValue['EditErrorMessageThree']);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-lg w-full">
      <h1 className="text-[#3C3C3C] text-3xl font-bold mb-5">{langValue['EditPlaylist']}</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="mb-5">
        <label htmlFor="playlist-name" className="block mb-2 text-sm font-medium text-gray-900">
          {langValue['PlaylistNameOne']}
        </label>
        <input
          type="text"
          id="playlist-name"
          className="bg-[#F5F5F5] border-0 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor="playlist-url" className="block mb-2 text-sm font-medium text-gray-900">
          {langValue['PlaylistURLOne']}
        </label>
        <input
          type="text"
          id="playlist-url"
          className="bg-[#F5F5F5] border-0 text-[#696CD6] text-sm rounded-lg block w-full p-2.5"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          required
        />
      </div>

      <div className="mb-5">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isProtected}
            onChange={(e) => setIsProtected(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
          <span className="ms-3 text-sm font-medium text-gray-700">{langValue['ProtectedPlaylist']}</span>
        </label>
        <b className="text-[13px] block text-[#7D7E81]">
                    <span className="text-red-600 mr-1">{langValue['noteFour']}:</span> 
                   {langValue['noteDescFour']}
                </b>
      </div>

      {isProtected && (
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            {langValue['PasswordOne']}
          </label>
          <input
            type="password"
            id="password"
            className="bg-[#F5F5F5] border-0 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={langValue["EnterpasswordOne"]}
          />
        </div>
      )}

      <center>
        <button
          type="submit"
          className="text-white bg-blue-900 font-medium rounded-lg text-sm w-[205px] py-2.5"
        >
          {langValue['SaveChanges']}
        </button>
      </center>
    </form>
  );
}

