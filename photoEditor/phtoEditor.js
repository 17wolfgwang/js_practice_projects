const $uploadSection = document.querySelector(".uploadSection");
const $editSection = document.querySelector(".editSection");
const $aftUploadSection = document.querySelector(".aftUploadSection");
const $uploadFileName = document.querySelector(".uploadFileName");
const $uploadImage = document.querySelector(".uploadImage");
const $editBtn = document.querySelector(".editBtn");
const $rechooseBtn = document.querySelectorAll(".rechooseBtn");
const $saveBtn = document.querySelector(".saveBtn");
const $undoBtn = document.querySelector(".undoBtn");
const $clearBtn = document.querySelector(".clearBtn");
const $canvas = document.querySelector(".canvas");
const $cursor = document.querySelector(".cursor");
const $cursorRange = document.querySelector(".cursorRange");
const $paletteColors = document.querySelectorAll(".paletteColor");
const ctx = $canvas.getContext("2d");

$canvas.width = 700;
$canvas.height = 700;

let editHistoryArray = [];
let index;
$cursorRange.style.display = "none";
$cursor.style.display = "none";
$aftUploadSection.style.display = "none";
$editSection.style.display = "none";
// Drawing function
ctx.strokeStyle = "black";
ctx.lineWidth = 16;

let painting = false;
function stopPainting() {
  painting = false;
}
function leaveCanvas() {
  $cursor.classList.remove("cursor");
  $cursor.classList.remove("cursorRange");
  $cursor.style.display = "none";
}
function startPainting(e) {
  // e.preventDefault();

  painting = true;
  if (e.type != "mouseout") {
    editHistoryArray.push(
      ctx.getImageData(0, 0, $canvas.width, $canvas.height)
    );
    index += 1;
  }
}
function onMouseMove(e) {
  $cursor.style.display = "block";
  $cursorRange.style.display = "block";
  $cursor.classList.add("cursor");
  $cursor.classList.add("cursorRange");
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

//Pick Color from palette
function pickColor(e) {
  ctx.strokeStyle = e.target.style.backgroundColor;
  $cursor.style.backgroundColor = e.target.style.backgroundColor;
  $cursor.style.border = e.target.style.backgroundColor;
}
if ($canvas) {
  $canvas.addEventListener("mousemove", onMouseMove);
  $canvas.addEventListener("mousedown", startPainting);
  $canvas.addEventListener("mouseup", stopPainting);
  $canvas.addEventListener("mouseleave", leaveCanvas);
}
// Clear Canvas
function clearCanvas() {
  applyImageToCanvas();
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  ctx.fillRect(0, 0, $canvas.width, $canvas.height);

  editHistoryArray = [];
}
// Undo editting
function undoEdit() {
  index = editHistoryArray.length;
  if (index <= 0) {
    clearCanvas();
  } else {
    // index -= 1;
    ctx.putImageData(editHistoryArray[index - 1], 0, 0);
    editHistoryArray.pop();
  }
}

// Upload Image
let fileName;
function loadFile(input) {
  let file = input.files[0];
  $uploadFileName.textContent = file.name;
  fileName = file.name;
  if (file) {
    $aftUploadSection.style.display = "flex";
    $uploadSection.style.display = "none";
  }

  $uploadImage.src = URL.createObjectURL(file);
}

//Edit Uploaded Image
let backgroundImage = new Image();
function applyImageToCanvas() {
  $aftUploadSection.style.display = "none";
  $editSection.style.display = "flex";
  backgroundImage.src = $uploadImage.src;
  backgroundImage.onload = function () {
    ctx.drawImage(backgroundImage, 0, 0, 700, 700);
  };
}

// rechooseImage
function rechooseImage() {
  location.reload();
}

//Change Brush Size
function changeBrushSize(e) {
  let size = e.value;
  let rangeValue = 0.1;
  ctx.lineWidth = size;
  $cursorRange.style.width = size * rangeValue + "rem";
  $cursorRange.style.height = size * rangeValue + "rem";
  $cursorRange.style.display = "none";
  $cursor.style.display = "none";
}

//Save Edited image
function saveEditedImage() {
  const saveImage = $canvas.toDataURL();
  const link = document.createElement("a");
  link.href = saveImage;
  link.download = `Edited ${fileName}`;
  link.click();
  link.remove();
}

Array.from($paletteColors).forEach((color) =>
  color.addEventListener("click", pickColor)
);
$editBtn.addEventListener("click", applyImageToCanvas);
Array.from($rechooseBtn).forEach((color) =>
  color.addEventListener("click", rechooseImage)
);
$saveBtn.addEventListener("click", saveEditedImage);
$undoBtn.addEventListener("click", undoEdit);
$clearBtn.addEventListener("click", clearCanvas);
