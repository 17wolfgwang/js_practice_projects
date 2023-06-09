
    const $subjectSection = document.querySelector(".subjectSection");
    const $subjectBtns = document.querySelectorAll(".subjectBtn");
    const $numberSection = document.querySelector(".numberSection");
    const $numberBtn = document.querySelector(".numberBtn");
    const $prepareSection = document.querySelector(".prepareSection");
    const $startBtn = document.querySelector(".startBtn");
    const $gameScreenSection = document.querySelector(".gameScreenSection");
    const $currentImage = document.querySelector(".currentImage")
    const $numberInput = document.querySelector(".numberInput");
    const $answer = document.querySelector(".answer");
    const $timeCountNum = document.querySelector(".timeCountNum");

$numberSection.style.display = 'none';
$prepareSection.style.display = 'none';
$gameScreenSection.style.display = 'none';

    // First screen : choose subject
    let subjectName = '';
    let imageFiles = '';

    $subjectBtns.forEach(subjectBtn => {
        subjectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            $subjectSection.style.display = 'none'
            $numberSection.style.display = 'block'
            subjectName = this.value;
            // call local image file based on chosen subject name with fetch API
            const folderPath = `./images/${subjectName}`;
            fetch(folderPath)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const imageElements = doc.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]');
                const imageFilesResult = Array.from(imageElements).map(element => element.textContent.trim().split(/(\d+)/)[0]);
                imageFiles = [...imageFilesResult]
            })
            .catch(error => console.log(error));
        })
    })

    // Second screen : enter number of players(it goes ..)
    let randomArray;
    function enterNumber(e) {
        e.preventDefault();
        if($numberInput.value <2 || $numberInput.value > 5 ){
            alert('2에서 5사이 숫자만 입력해주세요.')
        } else {
            $numberSection.style.display = 'none'
            $prepareSection.style.display = 'block';

            const questionNumber = $numberInput.value * 2 -1;
            const array = Array(questionNumber).fill().map((v,i) => i);
            randomArray = array.sort(()=> Math.random() -0.5);
        }
    }

    // Third screen : prepare for game(count 3)
    function prepareGame() {
        $gameScreenSection.style.display = 'block'
        $currentImage.style.display = 'none';
        $answer.style.display = 'none';
        $prepareSection.style.display = 'none';
        countDown()
        setTimeout(() => {
            makeQuestion();
        },4000)
    }

    //Forth screen : quiz start
    let photoIndex = 0;
    let timerld;
    function makeQuestion() {
        $currentImage.style.display = 'block';
        $answer.style.display = 'block';
        $answer.focus();
        // create random array based on number of photo
        clearInterval(countNum);
        $currentImage.src = `./images/${subjectName}/${imageFiles[randomArray[photoIndex]]}`;
        countDown();
        timerld = setTimeout(()=> {
            alert('탈락입니다');
            location.href = 'http://127.0.0.1:5500/%EC%9D%B8%EB%AC%BC%EB%A7%9E%EC%B6%94%EA%B8%B0%EA%B2%8C%EC%9E%84/character_quiz.html';
        },4000)
    }

    // Check if game if clear or not and show next question
    function checkAnswer() {
                clearInterval(countNum);
                if(photoIndex === randomArray.length -1) {
                    alert('성공!!!!')
                    location.href = 'http://127.0.0.1:5500/%EC%9D%B8%EB%AC%BC%EB%A7%9E%EC%B6%94%EA%B8%B0%EA%B2%8C%EC%9E%84/character_quiz.html';
                } else {
                    photoIndex++;
                    makeQuestion();
                }
    }

    //Enter answer
    function enter(e) {
        let correctAnswer = imageFiles[0].split('.')[0];
        // Use logical operator(&&) to prevent error cause of undefined.
        if(e && e.key === "Enter") {
            if(imageFiles[randomArray[photoIndex]] === `${$answer.value}.jpg`) {
                clearTimeout(timerld);
                checkAnswer()
                $answer.value = "";
            } else {
                $answer.value = "";
            }
        } else return;
    }

    //Show how many second left
    let countNum;
    function countDown() {
        let count = 4;
        $timeCountNum.textContent = '';
        countNum = setInterval(function() {
            count--;
            $timeCountNum.textContent = count;
            },1000)
    }

    // $sportBtn.addEventListener('click', selectSubject);
    $numberBtn.addEventListener('click', enterNumber);
    $startBtn.addEventListener('click',prepareGame)
    $answer.addEventListener('keydown', enter)
