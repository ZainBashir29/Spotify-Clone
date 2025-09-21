console.log("Lets write JavaScript");

let songs;
let currFolder;
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      // console.log(element.href.split(`${currFolder}`)[1].split("/")[1]);
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>

     <img class="invert" src="img/music.svg" alt="Music Icon">
                      <div class="info">
                          <div>${song.replaceAll("%20", " ")}</div>
                          <div>Zain Bashir</div>
                      </div>

                      <div class="playNow">
                          <span>Play Now</span>
                          <img class="invert image" src="img/play.svg" alt="Play Button">
                      </div>
    
    </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  // play.addEventListener("click", () => {
  //   if (currentSong.paused) {
  //     currentSong.play();
  //     play.src = "pause.svg";
  //   } else {
  //     currentSong.pause();
  //     play.src = "play.svg";
  //   }
  // });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  // console.log("Displaying Albums");
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(response);
  let cardContainer = document.querySelector(".cardContainer");
  let anchors = div.getElementsByTagName("a");
  // console.log(anchors);
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      // console.log(e.href.split("/").slice(-1)[0]);
      // console.log(folder);
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `  <div class="cardContainer">
                    <div data-folder=${folder} class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="19" height="19"
                                color="#000000" fill="#000000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg"
                            alt="Playlist Image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log(e);
    e.addEventListener("click", async (item) => {
      // console.log(item, item.currentTarget.dataset);
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("songs/ncs");
  // console.log(songs);
  playMusic(songs[0], true);

  displayAlbums();

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>

       <img class="invert" src="img/music.svg" alt="Music Icon">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Zain Bashir</div>
                        </div>

                        <div class="playNow">
                            <span>Play Now</span>
                            <img class="invert" src="img/play.svg" alt="Play Button">
                        </div>
      
      </li>`;
  }

  // var audio = new Audio(songs[0]);
  // audio.play();

  // audio.addEventListener("loadeddata", () => {
  //   console.log(audio.duration, audio.currentSrc, audio.currentTime);
  // The duration variable now holds the duration (in seconds) of the audio clip
  // });

  Array.from(
    document.querySelector(".songList").getElementsByClassName("image")
  ).forEach((e) => {
    e.addEventListener("click", (item) => {
      // console.log(item.target.src);
      if (item.target.src.includes("play.svg")) {
        if (currentSong.paused) {
          item.target.src = item.target.src.replace("play.svg", "pause.svg");
          currentSong.play();
          play.src = "pause.svg";
        }
      } else {
        item.target.src = item.target.src.replace("pause.svg", "play.svg");
        currentSong.pause();
        play.src = "play.svg";
      }
    });
  });

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    // console.log(e.target.getBoundingClientRect().width, e.offsetX);
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = 0 + "%";
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-145%";
});

play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  // else if (
  //   document
  //     .querySelector(".songList")
  //     .getElementsByClassName("image")
  //     .src.includes("pause")
  // ) {
  //   currentSong.pause();
  //   play.src = "play.svg";
  // }
  else {
    currentSong.pause();
    play.src = "img/play.svg";
  }
});

previous.addEventListener("click", () => {
  console.log("Previous clicked");
  console.log(currentSong.src.split("/"));
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
  } else {
    playMusic(songs[songs.length - 1]);
  }
});

next.addEventListener("click", () => {
  console.log("Next clicked");
  // console.log(songs);
  // console.log(currentSong.src);
  // console.log(currentSong.src.split("/").slice(-1)[0]);
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 <= songs.length - 1) {
    playMusic(songs[index + 1]);
  } else {
    playMusic(songs[0]);
  }
});

document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    // console.log("Setting volume to", e.target.value, "/100");
    currentSong.volume = parseInt(e.target.value) / 100;
    document.querySelector(".volume>img").src = document
      .querySelector(".volume>img")
      .src.replace("img/mute.svg", "img/volume.svg");
  });

document.querySelector(".volume>img").addEventListener("click", (e) => {
  // console.log(e.target.src);
  if (e.target.src.includes("img/volume.svg")) {
    e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  } else {
    e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
    currentSong.volume = 0.1;
    document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 10;
  }
});

main();

// function createHelloWorld() {
//   return function () {
//     return "Hello World";
//   };
// }

// const f = createHelloWorld();

// console.log(f());

// const createHelloWorld = function () {
//   return function (...args) {
//     return "Hello World";
//   };
// };

// const f = createHelloWorld();

// console.log(f({}, null, 42));
