const $uploadFileName = document.querySelector(".uploadFileName");
const $uploadImage = document.querySelector(".uploadImage");
const $canvas = document.querySelector(".canvas");
const ctx = $canvas.getContext("2d");

$canvas.width = 700;
$canvas.height = 700;

// ctx.strokeStyle = "#000000";
ctx.strokeStyle = "black";
ctx.lineWidth = 2.5;

let painting = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function onMouseDown(e) {
  painting = true;
}

if ($canvas) {
  $canvas.addEventListener("mousemove", onMouseMove);
  $canvas.addEventListener("mousedown", startPainting);
  $canvas.addEventListener("mouseup", stopPainting);
  $canvas.addEventListener("mouseleave", stopPainting);
}

// 이미지 불러오기
function loadFile(input) {
  let file = input.files[0];
  $uploadFileName.textContent = file.name;

  $uploadImage.src = URL.createObjectURL(file);
}

function pickColor(e) {
  ctx.strokeStyle = e.style.backgroundColor;
}

let backgroundImage = new Image();
console.log(backgroundImage);
function applyImageToCanvas() {
  backgroundImage.src = $uploadImage.src;
  backgroundImage.onload = function () {
    ctx.drawImage(backgroundImage, 0, 0, 500, 500);
  };
}

//Change Brush Size
function changeBrushSize(e) {
  ctx.lineWidth = e.value;
}
