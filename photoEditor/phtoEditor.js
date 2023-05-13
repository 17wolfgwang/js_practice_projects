const $uploadSection = document.querySelector(".uploadSection");
const $editSection = document.querySelector(".editSection");
const $uploadFileName = document.querySelector(".uploadFileName");
const $uploadImage = document.querySelector(".uploadImage");
const $saveBtn = document.querySelector(".saveBtn");
const $canvas = document.querySelector(".canvas");
const $cursor = document.querySelector(".cursor");
const $cursorRange = document.querySelector(".cursorRange");
const $paletteColors = document.querySelectorAll(".paletteColor");
const ctx = $canvas.getContext("2d");

$canvas.width = 700;
$canvas.height = 700;

// Drawing function
ctx.strokeStyle = "black";
ctx.lineWidth = 2.5;

let painting = false;
function stopPainting() {
  painting = false;
  $cursor.classList.remove("cursor");
}
function startPainting() {
  painting = true;
}
function onMouseMove(e) {
  $cursor.classList.add("cursor");
  $cursor.style.top = e.pageY + "px";
  $cursor.style.left = e.pageX + "px";
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

function clearCanvas() {
  applyImageToCanvas();
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

// Upload Image
let fileName;
function loadFile(input) {
  let file = input.files[0];
  $uploadFileName.textContent = file.name;
  fileName = file.name;

  $uploadImage.src = URL.createObjectURL(file);
}

//Pick Color from palette
function pickColor(e) {
  ctx.strokeStyle = e.target.style.backgroundColor;
  $cursor.style.backgroundColor = e.target.style.backgroundColor;
  $cursor.style.border = e.target.style.backgroundColor;
}

let backgroundImage = new Image();
console.log(backgroundImage);
function applyImageToCanvas() {
  backgroundImage.src = $uploadImage.src;
  backgroundImage.onload = function () {
    ctx.drawImage(backgroundImage, 0, 0, 700, 700);
  };
}

//Change Brush Size
function changeBrushSize(e) {
  let size = e.value;
  let rangeValue = 0.1;
  ctx.lineWidth = size;
  $cursorRange.style.width = size * rangeValue + "rem";
  $cursorRange.style.height = size * rangeValue + "rem";
}

//Save Edited image
function saveEditedImage() {
  const saveImage = $canvas.toDataURL();
  const link = document.createElement("a");
  link.href = saveImage;
  link.download = `${fileName} Edited`;
  link.click();
}

Array.from($paletteColors).forEach((color) =>
  color.addEventListener("click", pickColor)
);

$saveBtn.addEventListener("click", saveEditedImage);
