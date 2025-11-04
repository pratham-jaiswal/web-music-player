document.addEventListener("DOMContentLoaded", async () => {
    // Initialize core variables and DOM references
    let songIndex = 0;
    let audioElement = new Audio("Songs/1.mp3");
    let masterPlay = document.getElementById("masterPlay");
    let myProgressBar = document.getElementById("myProgressBar");
    let gif = document.getElementById("gif");
    let masterSongName = document.getElementById("masterSongName");
    const songItemContainer = document.getElementById("songItemContainer");

    // Song directory and file list
    let songsDir = "Songs/";
    let songFiles = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3"];
    let songs = [];

    // Helper: Convert album art binary to base64
    function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
        return window.btoa(binary);
    }

    // Load songs and read metadata (title, artist, cover)
    await Promise.all(
        songFiles.map((file, i) =>
            fetch(songsDir + file)
                .then((res) => res.blob())
                .then(
                    (blob) =>
                        new Promise((resolve) => {
                            jsmediatags.read(blob, {
                                onSuccess: (tag) => {
                                    const picture = tag.tags.picture;
                                    let imageSrc = "default.png";
                                    if (picture) {
                                        const base64String = arrayBufferToBase64(picture.data);
                                        imageSrc = `data:${picture.format};base64,${base64String}`;
                                    }
                                    songs[i] = {
                                        songName:
                                            (tag.tags.title || `Unknown ${i + 1}`) +
                                            " - " +
                                            (tag.tags.artist || "Unknown Artist"),
                                        filePath: songsDir + file,
                                        cover: imageSrc,
                                    };
                                    resolve();
                                },
                                onError: (error) => {
                                    // Fallback for missing metadata
                                    songs[i] = {
                                        songName: `Song ${i + 1}`,
                                        filePath: songsDir + file,
                                        cover: "default_cover.jpg",
                                    };
                                    resolve();
                                },
                            });
                        })
                )
        )
    );

    // Render song list dynamically
    songItemContainer.innerHTML = songs
        .map(
            (song, i) => `
      <div class="songItem">
        <img src="${song.cover}" alt="cover">
        <span class="songName">${song.songName}</span>
        <span class="songListPlay">
          <i id="${i}" class="far songItemPlay fa-play-circle"></i>
        </span>
      </div>
    `
        )
        .join("");

    // Toggle play/pause for master button
    masterPlay.addEventListener("click", () => {
        if (audioElement.paused || audioElement.currentTime <= 0) {
            songItemPlayFn(songIndex);
        } else {
            songItemPauseFn(songIndex);
        }
    });

    // Update progress bar as song plays
    audioElement.addEventListener("timeupdate", () => {
        progress = parseInt(
            (audioElement.currentTime / audioElement.duration) * 100
        );
        myProgressBar.value = progress;

        // Automatically move to next song when done
        if (progress >= 100) {
            masterPlay.classList.remove("fa-pause-circle");
            masterPlay.classList.add("fa-play-circle");
            gif.style.opacity = 0;
            nextSong();
        }
    });

    // Allow manual scrubbing
    myProgressBar.addEventListener("change", () => {
        audioElement.currentTime =
            (myProgressBar.value * audioElement.duration) / 100;
    });

    // Reset all play buttons
    const makeAllPlays = () => {
        Array.from(document.getElementsByClassName("songItemPlay")).forEach(
            (element) => {
                element.classList.remove("fa-pause-circle");
                element.classList.add("fa-play-circle");
            }
        );
    };

    // Attach click listeners to each song item
    Array.from(document.getElementsByClassName("songItemPlay")).forEach(
        (element) => {
            element.addEventListener("click", (e) => {
                makeAllPlays();
                songIndex = parseInt(e.target.id);
                songItemPlayFn(songIndex);
            });
        }
    );

    // Play a specific song
    function songItemPlayFn(songIndex) {
        let songItemPlay = document.getElementById(songIndex);
        songItemPlay.classList.remove("fa-play-circle");
        songItemPlay.classList.add("fa-pause-circle");
        if (!audioElement.paused || myProgressBar.value >= 100) {
            audioElement.src = `Songs/${songIndex + 1}.mp3`;
        }
        gif.style.opacity = 1;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.play();
        masterPlay.classList.remove("fa-play-circle");
        masterPlay.classList.add("fa-pause-circle");
    }

    // Pause current song
    function songItemPauseFn(songIndex) {
        let songItemPause = document.getElementById(songIndex);
        songItemPause.classList.remove("fa-pause-circle");
        songItemPause.classList.add("fa-play-circle");
        gif.style.opacity = 0;
        audioElement.pause();
        masterPlay.classList.remove("fa-pause-circle");
        masterPlay.classList.add("fa-play-circle");
    }

    // Next song control
    document.getElementById("next").addEventListener("click", () => {
        nextSong();
    });

    // Previous song control
    document.getElementById("previous").addEventListener("click", () => {
        makeAllPlays();
        if (songIndex <= 0) {
            songIndex = 4;
        } else {
            songIndex -= 1;
        }
        songItemPlayFn(songIndex);
    });

    // Auto-play next song
    function nextSong() {
        makeAllPlays();
        if (songIndex >= 4) {
            songIndex = 0;
        } else {
            songIndex += 1;
        }
        songItemPlayFn(songIndex);
    }
});
