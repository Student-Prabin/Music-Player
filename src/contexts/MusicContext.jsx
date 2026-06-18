import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

const songs = [
 {
        id: 1,
        title: 'Piano Man',
        artist: 'Billy Joel',
        url: "/Songs/Billy Joel - Piano Man (Lyrics).mp3",
        duration: '5:39'
    }, {
        id: 2,
        title: 'Bhawana',
        artist: 'Bipul Chettri',
        url: "/Songs/Bipul Chettri - Bhawana (Official Music Video).mp3",
        duration: '3:45'
    }, {
        id: 3,
        title: 'Hami',
        artist: 'Prajina X Regan',
        url: "/Songs/Hami - Prajina X Regan ( Directed by Sayun Shakya ).mp3",
        duration: '3:45'
    }, {
        id: 4,
        title: 'Summertime Sadness',
        artist: 'Lana Del Rey',
        url: "/Songs/Lana Del Rey - Summertime Sadness (Official Music Video).mp3",
        duration: '3:45'
    }, {
        id: 5,
        title: 'Let Her Go',
        artist: 'Passenger',
        url: "/Songs/Passenger _ Let Her Go (Official Video).mp3",
        duration: '3:45'
    }, {
        id: 6,
        title: 'Sadhana',
        artist: 'John Rai',
        url: "/Songs/SADHANA ( साधना ).mp3",
        duration: '3:45'
    }, {
        id: 7,
        title: 'Nobody New',
        artist: 'The Marias',
        url: "/Songs/The Marías ~ Nobody New (Lyrics).mp3",
        duration: '3:45'
    }, {
        id: 8,
        title: 'Riptide',
        artist: 'Vance Joy',
        url: "/Songs/Vance Joy - 'Riptide' Official Video.mp3",
        duration: '3:45'
    },{
        id: 8,
        title: 'Riptide',
        artist: 'Vance Joy',
        url: "/Songs/Vance Joy - 'Riptide' Official Video.mp3",
        duration: '3:45'
    }
];
export const MusicProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
    if (savedPlaylists) {
      const playlists = JSON.parse(savedPlaylists);
      setPlaylists(playlists);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("musicPlayerPlaylists");
    }
  }, [playlists]);

  const handlePlaySong = (song, index) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setIsPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId)
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      })
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{
        allSongs,
        handlePlaySong,
        currentTrackIndex,
        currentTrack,
        setCurrentTime,
        currentTime,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        createPlaylist,
        playlists,
        addSongToPlaylist,
        setCurrentTrack,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);
  if (!contextValue) {
    throw new Error("useMusic must be used inside of MusicProvider");
  }

  return contextValue;
};