const $container = document.querySelector(".container");
const $addBox = document.querySelector(".addbox");
const $modal = document.querySelector(".modal");
const $titleInput = $modal.querySelector("#title");
const $linkInput = $modal.querySelector("#link");
const $submitBtn = $modal.querySelector("#submit");
const $closeBtn = $modal.querySelector(".close");
const $videoTitle = document.querySelector(".videoTitle");
//items[0].children[1].textContent
// const $title = document.querySelectorAll(".title");

let player;
let done = false;
let nowPlay;
let items;

// Youtube API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Load local storage on page reload
window.onload = function () {
  let savedData = JSON.parse(localStorage.getItem("boxData")) || [];
  for (let i = 0; i < savedData.length; i++) {
    let outerDiv = document.createElement("div");
    outerDiv.setAttribute("class", "box");
    outerDiv.setAttribute("draggable", "true");
    outerDiv.innerHTML = `${savedData[i]}`;
    let deleteBtn = outerDiv.querySelector(".delete");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteBox(e);
    });
    $container.insertBefore(outerDiv, $addBox);
  }
};

/*
It is essential to define 'onYouTubeIframeAPIReady' function.
After finishing download Player API, invoke this function.
Display player object to show on page load.
 */
function onYouTubeIframeAPIReady() {
  player = new YT.Player("video", {
    height: "400", // Not necessary when <iframe> tag defined.
    width: "800", // Not necessary when <iframe> tag defined.
    videoId: "K4TOrB7at0Y", // Not necessary when <iframe> tag defined.
    playerVars: {
      // <iframe> Not necessary when <iframe> tag defined.
      controls: "2",
    },
    events: {
      // 'onReady': 'onPlayerReady' function, // This will be executed every time the player has finished loading and is ready to receive API calls.
      onStateChange: onPlayerStateChange, // Executed whenever the player's state changes.
    },
  });
}
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
  if (event.data == YT.PlayerState.ENDED) {
    let child = items[0];
    deleteLocalStorage(child);
    child.remove();
    player.loadVideoById(nextPlay());
    player.playVideo();
    $videoTitle.classList.add("gradient");
  }
}
function playYoutube() {
  $videoTitle.classList.add("gradient");
  player.playVideo();
}
function pauseYoutube() {
  $videoTitle.classList.remove("gradient");
  player.pauseVideo();
}
function stopYoutube() {
  $videoTitle.classList.remove("gradient");
  player.seekTo(0, true); // Move playtime of the video to 0.
  player.stopVideo();
}
function nextYoutube() {
  let child = items[0];
  deleteLocalStorage(child);
  child.remove();
  player.loadVideoById(nextPlay());
  // player.cueVideoById(nextPlay()); //Code for delaying auto-play of the next video.
}

//Drag & Drop Playlist
function handleDragStart(e) {
  this.style.opacity = "0.4";
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}
function handleDragEnd(e) {
  this.style.opacity = "1";
  items.forEach(function (item) {
    item.classList.remove("over");
  });
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}
function handleDragEnter(e) {
  this.classList.add("over");
}
function handleDragLeave(e) {
  this.classList.remove("over");
}
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  /*
    dragSrcEl is declared when clicked and is the value of the element that was first clicked.
    "this" is generated with "drop" and is the value of the destination div, as it is the value of the "this" in the destination div.
    Since these two values are different, the value of dragSrcEl.innerHTML (the value of the originally selected div) will be replaced with the value of the destination div.
    The value of the div saved during the first click (e.dataTransfer.setData('text/html', this.innerHTML)) is then retrieved and set as the value of the destination div!
    */
  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
    addDeleteFunction();
    const childs = $container.querySelectorAll(".box");
    const test = Array.from(childs);
    let eleArr = [];
    for (let i = 0; i < test.length; i++) {
      let ele = test[i].innerHTML;
      eleArr.push(ele);
    }
    localStorage.removeItem("boxData");
    localStorage.setItem("boxData", JSON.stringify(eleArr));
  }
  //Better clear than 'null' value
  return false;
}
function addDeleteFunction() {
  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteBox(e);
    });
  });
}

// MutationObserver function is to detect changes in child nodes, and when a change is detected, execute the function inside!
const observer = new MutationObserver(function (mutationList, observer) {
  for (let mutation of mutationList) {
    if (mutation.type === "childList") {
      items = document.querySelectorAll(".container .box");
      items.forEach(function (item) {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("dragenter", handleDragEnter);
        item.addEventListener("dragleave", handleDragLeave);
        item.addEventListener("dragend", handleDragEnd);
        item.addEventListener("drop", handleDrop);
      });
    }
  }
});
observer.observe($container, { childList: true });

function nextPlay() {
  nowPlay = items[0].children[1].textContent;
  let videoName = items[0].children[0].textContent;
  $videoTitle.textContent = videoName;
  let videoId = "";
  if (nowPlay.startsWith("https://youtu.be/")) {
    videoId = nowPlay.split("https://youtu.be/")[1].substring(0, 11);
  } else if (nowPlay.startsWith("https://www.youtube.com/")) {
    videoId = nowPlay.split("v=")[1].substring(0, 11);
  }
  return videoId;
}

// Modal
$modal.style.display = "none";
function showModal() {
  $modal.style.display = "block";
}
function closeModal() {
  addBox();
  clearInput();
  $modal.style.display = "none";
}
function clearInput() {
  $titleInput.value = "";
  $linkInput.value = "";
}

// Add, delete playlist box
function addBox() {
  let title = $titleInput.value;
  let link = $linkInput.value;
  const newDivEle = document.createElement("div");
  const newDivChildEle1 = document.createElement("div");
  const newDivChildEle2 = document.createElement("div");
  const newDivChildEle3 = document.createElement("span");
  newDivEle.setAttribute("class", "box");
  newDivEle.setAttribute("draggable", "true");
  newDivChildEle1.setAttribute("class", "title");
  newDivChildEle2.setAttribute("class", "link");
  newDivChildEle3.setAttribute("class", "delete");
  newDivChildEle1.textContent = title;
  newDivChildEle2.textContent = link;
  newDivChildEle2.style.display = "none";
  newDivChildEle3.textContent = "X";
  newDivChildEle3.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteBox(e);
  });
  if (newDivChildEle2.innerHTML === "") {
    return;
  } else if (
    !newDivChildEle2.innerHTML.startsWith("https://www.youtube.com") &&
    !newDivChildEle2.innerHTML.startsWith("https://youtu.be/")
  ) {
    alert(
      "URL은 'https://www.youtube.com' 또는 'https://youtu.be/'로 시작해야 합니다."
    );
    return;
  } else {
    newDivEle.appendChild(newDivChildEle1);
    newDivEle.appendChild(newDivChildEle2);
    newDivEle.appendChild(newDivChildEle3);
  }
  $container.insertBefore(newDivEle, $addBox);

  let savedData = JSON.parse(localStorage.getItem("boxData")) || [];
  savedData.push(newDivEle.innerHTML);
  localStorage.setItem("boxData", JSON.stringify(savedData));
}

function deleteBox(e) {
  //   e.stopPropagation();
  const clickedDiv = e.currentTarget.parentNode;
  //   console.log(e.target);
  deleteLocalStorage(clickedDiv);
  clickedDiv.remove();
}

function deleteLocalStorage(one) {
  const parentNode = one.parentNode;
  const childs = parentNode.querySelectorAll(".box");
  const divs = Array.from(childs);
  const index = divs.indexOf(one);
  const boxData = JSON.parse(localStorage.getItem("boxData"));
  delete boxData[index];
  const filterArr = boxData.filter(
    (item) => item !== null || item !== undefined
  );
  localStorage.setItem("boxData", JSON.stringify(filterArr));
}

$addBox.addEventListener("click", showModal);
$submitBtn.addEventListener("click", closeModal);
$closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", function (e) {
  if (e.target === $modal) {
    closeModal();
    clearInput();
  }
});
