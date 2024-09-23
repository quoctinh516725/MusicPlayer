import { songs } from "./api.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const dashboard = $(".dashboard");
const cd = $(".cd");
const playlist = $("#playlist");
const play = $(".btn-play");
const audio = $("#audio");
const heading = $(".titleSong");
const thumb = $(".cd-thumb");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-pre");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $("#playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  start: function () {
    this.handelEvents();
    this.defineProperty();
    this.renderSong();
    this.renderPlaylist();
  },
  defineProperty: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return songs[this.currentIndex];
      },
    });
  },
  renderSong: function () {
    heading.textContent = this.currentSong.song;
    thumb.style.backgroundImage = `url(${this.currentSong.thumb})`;
    audio.src = this.currentSong.url;
  },
  updateActiveSong: function () {
    const items = $$("#playlist .playlist__item");
    items.forEach((item, index) => {
      item.classList.toggle("active", index === this.currentIndex);
    });
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= songs.length) {
      this.currentIndex = 0;
    }
    this.renderSong();
    this.updateActiveSong();
  },
  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = songs.length - 1;
    }
    this.renderSong();
    this.updateActiveSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.renderSong();
    this.updateActiveSong();
  },
  renderPlaylist: function () {
    const html = songs.map((song, index) => {
      return `
        <div class="playlist__item ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div
            class="playlist__thumb"
            style="background: url(${song.thumb}) no-repeat center/cover"
          ></div>
          <div class="infor">
            <div class="title-song">${song.song}</div>
            <div class="singer-song">${song.singer}</div>
          </div>
          <div class="option"><i class="fas fa-ellipsis-h"></i></div>
        </div>
        `;
    });
    $("#playlist").innerHTML = html.join("");
    // this.handleSongClickEvents();
  },
  // handleSongClickEvents: function () {
  //   const _this = this;
  //   const playListItems = $$(".playlist__item");

  //   playListItems.forEach((item, index) => {
  //     item.onclick = function () {
  //       _this.currentIndex = index;
  //       _this.renderSong();
  //       _this.updateActiveSong();
  //       audio.play();
  //     };
  //   });
  // },
  handelEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    const cdThumbAnimate = thumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    document.onscroll = function () {
      //Lấy chiều dài Y khi scroll
      const scroll = window.scrollY;
      //set width cho thumb khi scroll
      const updateWidth = cdWidth - scroll;
      cd.style.width = updateWidth > 0 ? updateWidth + "px" : 0;
    };
    play.onclick = function () {
      if (_this.isPlaying) {
        play.innerHTML = `<i class="fa-solid fa-play"></i>`;
        _this.isPlaying = false;
        audio.pause();
        cdThumbAnimate.pause();
      } else {
        _this.isPlaying = true;
        play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        audio.play();
        cdThumbAnimate.play();
      }
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const updateTime = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = updateTime;
      }
    };

    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    //Handle nextBtn
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      if (!_this.isPlaying) {
        play.click();
      }
    };
    preBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.preSong();
      }
      audio.play();
      if (!_this.isPlaying) {
        play.click();
      }
    };
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    playList.onclick = function (e) {
      if (
        e.target.closest(".playlist__item:not(.active") ||
        e.target.closest(".option")
      ) {
        if (!e.target.closest(".option")) {
          _this.currentIndex = parseInt(e.target.closest(".playlist__item").dataset.index);
          _this.renderSong();
          _this.updateActiveSong();
          audio.play();
          if (!_this.isPlaying) {
            play.click();
          }
        }
      }
    };
  },
};
app.start();
