const $uploadFileName = document.querySelector(".uploadFileName");
const $uploadImage = document.querySelector(".uploadImage");

// 이미지 불러오기
function loadFile(input) {
  let file = input.files[0];
  $uploadFileName.textContent = file.name;

  $uploadImage.src = URL.createObjectURL(file);
}
