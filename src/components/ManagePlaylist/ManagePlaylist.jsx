import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Lang } from "../../lang.jsx";
import classes from './ManagePlaylist.module.css'
import { toast } from "react-toastify";

function ManagePlaylist() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const selectedLanguage = localStorage.getItem("lang") || 'en';
  const langValue = Lang[selectedLanguage];

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://shplayer.onrender.com/playList/get", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `shM0${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setPlaylists(data.allPlaylists);
          setFilteredPlaylists(data.allPlaylists);
        } else {
          setError("Failed to load playlists");
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();

    // Get MAC address from localStorage
    const storedMacAddress = localStorage.getItem('macAddress');
    if (storedMacAddress) {
      setMacAddress(storedMacAddress);
    }
  }, []);

  const activePlayeList = async (playListID) => {
    setIsDisabled(true)
    try {
      const response = await fetch(`https://shplayer.onrender.com/playList/active/${playListID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        let playlistArray = data.allPlaylists;
        playlistArray.reverse()
        setPlaylists(playlistArray);
        setFilteredPlaylists(playlistArray);
      } else {
        setError("Failed to active playlists");
      }
    } catch (err) {
      console.error("Error fetching playlists:", err);
      setError("Failed to active playlists");
    } finally {
      setLoading(false);
      setIsDisabled(false)
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query) ||
      (playlist.url && playlist.url.toLowerCase().includes(query))
    );
    setFilteredPlaylists(filtered);
  };

  const handleDelete = async (playlistId) => {
    try {
      const response = await fetch(`https://shplayer.onrender.com/playList/delete/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `shM0${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      setPlaylists(playlists.filter((playlist) => playlist._id !== playlistId));
      setFilteredPlaylists(filteredPlaylists.filter((playlist) => playlist._id !== playlistId));
    } catch (err) {
      setError("Failed to delete playlist");
    }
  };

  const handleEdit = (playlist) => {
    if (playlist.isProtected) {
      setSelectedPlaylist(playlist);
      setIsPasswordModalOpen(true);
    } else {
      navigate(`editplaylist/${playlist._id}`, { state: { playlist } });
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordError('');
    try {
      const response = await fetch(`https://shplayer.onrender.com/playList/checkPassword/${selectedPlaylist._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `shM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsPasswordModalOpen(false);
        toast.success(data.message, {
          theme: 'dark'
        });
        navigate(`editplaylist/${selectedPlaylist._id}`, {
          state: {
            playlist: selectedPlaylist,
            password
          }
        });
      } else {
        switch (response.status) {
          case 404:
            setPasswordError('Playlist not found');
            break;
          case 400:
            setPasswordError(data.message || 'Invalid request');
            break;
          case 500:
            setPasswordError('Server error occurred');
            break;
          default:
            setPasswordError('An error occurred. Please try again.');
        }
      }
    } catch (err) {
      console.error("Error checking password:", err);
      toast.error('An error occurred. Please try again.', {
        theme: 'dark'
      });
      setPasswordError('An error occurred. Please try again.');
    }
  };
  function checkBoxChecked(e, playListID) {
    if (!e.target.checked) {
      return;
    }
    activePlayeList(playListID)
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-[#AEB3BD]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full border-none bg-[#F5F5F5] rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-[#AEB3BD] outline-none"
              placeholder="Search"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-shrink-0 text-black bg-white border border-transparent border-b-black font-medium rounded-lg text-sm py-2.5 w-full sm:w-[180px] sm:bg-black sm:text-white text-center">
              {macAddress || 'No MAC Address'}
            </button>
            <NavLink to="addplaylist" className="flex-shrink-0 w-full sm:w-auto">
              <button className="w-full text-white bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5">
                {langValue['AddPlaylist']}
              </button>
            </NavLink>
          </div>
        </div>

        {loading ? (
          <p>{langValue["LoadingPlaylists"]}</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden overflow-x-auto">
            <div className={`${classes.table_header} grid grid-cols-12 bg-[#F9FAFB] border-b py-4 px-6`}>
              <div className="col-span-3 text-[#4B4C4C] font-medium">{langValue['Playlist']}</div>
              <div className="col-span-7 text-[#4B4C4C] font-medium mx-6">URL</div>
              <div className="col-span-2 text-[#4B4C4C] font-medium text-right">{langValue['Actions']}</div>
            </div>

            <div className="divide-y">
              {filteredPlaylists.map((playlist) => (
                <div key={playlist._id} className={`grid grid-cols-12 py-4 px-6 items-center hover:bg-gray-50`}>
                  <div className="col-span-3 text-black">{playlist.playlist_name}</div>
                  <div className="col-span-7 text-[#696CD6] truncate mx-6">
                    {playlist.isProtected ? "Protected" : playlist.url}
                  </div>
                  <div className="col-span-2 gap-3 flex md:justify-end md:gap-5 justify-between">
                    <span
                      className="icon-[ri--edit-2-fill] text-[#7680DE] text-lg cursor-pointer flex-shrink-0"
                      onClick={() => handleEdit(playlist)}
                    ></span>
                    <span
                      className="icon-[ic--baseline-delete] text-[#D40F0F] text-lg cursor-pointer flex-shrink-0"
                      onClick={() => handleDelete(playlist._id)}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">Enter Password</Dialog.Title>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              placeholder="Enter password"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-[#C067C8] rounded-md hover:bg-[#C067C8]/90"
              >
                Submit
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default ManagePlaylist;

