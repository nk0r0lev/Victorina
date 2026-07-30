// ============================================
// СВОЯ ИГРА
// app.js
// Версия 1.0
// ============================================

"use strict";


// ============================================
// ГЛОБАЛЬНЫЕ ДАННЫЕ
// ============================================

let gameData = [];

let openedQuestions = {};

let scores = [0, 0, 0, 0];

let currentQuestion = null;

let timer = null;

let seconds = 30;


// ============================================
// ЭЛЕМЕНТЫ СТРАНИЦЫ
// ============================================

const board = document.getElementById("gameBoard");

const modal = document.getElementById("questionModal");

const questionTitle = document.getElementById("questionTitle");

const questionText = document.getElementById("questionText");

const answerText = document.getElementById("answerText");

const mediaContainer = document.getElementById("mediaContainer");

const timerBlock = document.getElementById("timer");

const showAnswerButton = document.getElementById("showAnswer");

const closeQuestionButton = document.getElementById("closeQuestion");

const resetButton = document.getElementById("resetBtn");

const fullscreenButton = document.getElementById("fullscreenBtn");


// ============================================
// ЗАГРУЗКА ВОПРОСОВ
// ============================================

async function loadQuestions(){

    try{

        const response = await fetch("questions.json");

        gameData = await response.json();


        loadGame();

        createBoard();

        updateScores();


    }
    catch(error){

        console.error(
            "Ошибка загрузки вопросов:",
            error
        );

        alert(
            "Не найден файл questions.json"
        );

    }

}


// запуск

loadQuestions();



// ============================================
// СОЗДАНИЕ ИГРОВОГО ПОЛЯ
// ============================================

function createBoard(){

    board.innerHTML = "";


    // Заголовки тем

    gameData.forEach((topic)=>{


        let title =
        document.createElement("div");


        title.className =
        "topic";


        title.innerHTML =
        topic.title;


        board.appendChild(title);


    });



    // Вопросы

    for(
        let level = 0;
        level < 5;
        level++
    ){


        gameData.forEach(
        (topic, topicIndex)=>{


            let question =
            topic.questions[level];


            let button =
            document.createElement("div");


            button.className =
            "question";


            button.innerHTML =
            question.points;



            let id =
            topicIndex +
            "_" +
            level;



            if(openedQuestions[id]){

                button.classList.add(
                    "used"
                );

            }



            button.onclick = ()=>{


                if(
                    button.classList.contains(
                        "used"
                    )
                ){

                    return;

                }



                openQuestion(
                    topicIndex,
                    level,
                    button
                );


            };



            board.appendChild(button);


        });

    }

}

// ============================================
// ОТКРЫТИЕ ВОПРОСА
// ============================================

function openQuestion(topicIndex, questionIndex, button){


    currentQuestion = {

        topicIndex: topicIndex,

        questionIndex: questionIndex,

        button: button

    };



    const topic =
    gameData[topicIndex];


    const question =
    topic.questions[questionIndex];



    // Заголовок

    questionTitle.innerHTML =

        topic.title +

        "<br><span>" +

        question.points +

        " баллов</span>";



    // Вопрос

    questionText.innerHTML =

        question.question;



    // Ответ скрываем

    answerText.style.display = "none";

    answerText.innerHTML =

        question.answer;



    // Очистка медиа

    mediaContainer.innerHTML = "";



    // ============================
    // Картинка
    // ============================

    if(question.image){


        let image =
        document.createElement("img");


        image.src =
        question.image;


        mediaContainer.appendChild(
            image
        );

    }



    // ============================
    // Аудио
    // ============================

    if(question.audio){


        let audio =
        document.createElement("audio");


        audio.controls = true;


        audio.src =
        question.audio;


        mediaContainer.appendChild(
            audio
        );

    }



    // ============================
    // Видео
    // ============================

    if(question.video){


        let video =
        document.createElement("video");


        video.controls = true;


        video.src =
        question.video;


        mediaContainer.appendChild(
            video
        );

    }



    // Открываем окно

    modal.classList.remove(
        "hidden"
    );



    startTimer();


}



// ============================================
// ПОКАЗ ОТВЕТА
// ============================================

showAnswerButton.onclick = function(){


    answerText.style.display =
    "block";


};




// ============================================
// ЗАКРЫТИЕ ВОПРОСА
// ============================================

closeQuestionButton.onclick = function(){


    stopTimer();



    modal.classList.add(
        "hidden"
    );



    if(currentQuestion){



        let id =

        currentQuestion.topicIndex +

        "_" +

        currentQuestion.questionIndex;



        openedQuestions[id] = true;



        currentQuestion.button.classList.add(
            "used"
        );



        saveGame();



    }


};
// ============================================
// ТАЙМЕР
// ============================================


function startTimer(){


    stopTimer();


    seconds = 30;


    timerBlock.innerHTML =
    seconds;



    timerBlock.classList.remove(
        "timerWarning"
    );



    timer = setInterval(function(){



        seconds--;



        timerBlock.innerHTML =
        seconds;



        if(seconds <= 10){


            timerBlock.classList.add(
                "timerWarning"
            );


        }



        if(seconds <= 0){


            stopTimer();


            timerBlock.innerHTML =
            "0";


        }



    },1000);


}




function stopTimer(){


    if(timer){


        clearInterval(timer);


        timer = null;


    }


}




// ============================================
// СОХРАНЕНИЕ ИГРЫ
// ============================================


function saveGame(){



    localStorage.setItem(

        "quizOpened",

        JSON.stringify(
            openedQuestions
        )

    );



    localStorage.setItem(

        "quizScores",

        JSON.stringify(
            scores
        )

    );



}




// ============================================
// ЗАГРУЗКА СОХРАНЕНИЯ
// ============================================


function loadGame(){



    let savedQuestions =

    localStorage.getItem(
        "quizOpened"
    );



    let savedScores =

    localStorage.getItem(
        "quizScores"
    );



    if(savedQuestions){


        openedQuestions =

        JSON.parse(
            savedQuestions
        );


    }



    if(savedScores){


        scores =

        JSON.parse(
            savedScores
        );


    }



}




// ============================================
// ОБНОВЛЕНИЕ СЧЕТА
// ============================================


function updateScores(){



    for(
        let i = 1;
        i <= 4;
        i++
    ){



        let element =

        document.getElementById(
            "score"+i
        );



        if(element){


            element.innerHTML =

            scores[i-1];


        }


    }


}
// ============================================
// ИЗМЕНЕНИЕ СЧЕТА КОМАНД
// ============================================


function changeScore(team, value){


    let index = team - 1;


    scores[index] += value;



    if(scores[index] < 0){

        scores[index] = 0;

    }



    updateScores();


    saveGame();


}





// ============================================
// КНОПКА НОВОЙ ИГРЫ
// ============================================


if(resetButton){


    resetButton.onclick = function(){



        let confirmReset = confirm(

            "Начать новую игру? Все результаты будут удалены."

        );



        if(!confirmReset){

            return;

        }



        openedQuestions = {};

        scores = [0,0,0,0];



        localStorage.removeItem(
            "quizOpened"
        );


        localStorage.removeItem(
            "quizScores"
        );



        updateScores();


        createBoard();



    };


}





// ============================================
// ПОЛНОЭКРАННЫЙ РЕЖИМ
// ============================================


if(fullscreenButton){


    fullscreenButton.onclick = function(){



        if(!document.fullscreenElement){



            document.documentElement
            .requestFullscreen()
            .catch(
                error =>
                console.log(error)
            );



        }
        else{


            document.exitFullscreen();


        }


    };


}





// ============================================
// ЗАКРЫТИЕ ОКНА ПО ESC
// ============================================


document.addEventListener(

"keydown",

function(event){


    if(event.key === "Escape"){


        if(
            !modal.classList.contains(
                "hidden"
            )
        ){


            modal.classList.add(
                "hidden"
            );


            stopTimer();


        }


    }


}

);
// ============================================
// ИЗМЕНЕНИЕ СЧЕТА КОМАНД
// ============================================


function changeScore(team, value){


    let index = team - 1;


    scores[index] += value;



    if(scores[index] < 0){

        scores[index] = 0;

    }



    updateScores();


    saveGame();


}





// ============================================
// КНОПКА НОВОЙ ИГРЫ
// ============================================


if(resetButton){


    resetButton.onclick = function(){



        let confirmReset = confirm(

            "Начать новую игру? Все результаты будут удалены."

        );



        if(!confirmReset){

            return;

        }



        openedQuestions = {};

        scores = [0,0,0,0];



        localStorage.removeItem(
            "quizOpened"
        );


        localStorage.removeItem(
            "quizScores"
        );



        updateScores();


        createBoard();



    };


}





// ============================================
// ПОЛНОЭКРАННЫЙ РЕЖИМ
// ============================================


if(fullscreenButton){


    fullscreenButton.onclick = function(){



        if(!document.fullscreenElement){



            document.documentElement
            .requestFullscreen()
            .catch(
                error =>
                console.log(error)
            );



        }
        else{


            document.exitFullscreen();


        }


    };


}





// ============================================
// ЗАКРЫТИЕ ОКНА ПО ESC
// ============================================


document.addEventListener(

"keydown",

function(event){


    if(event.key === "Escape"){


        if(
            !modal.classList.contains(
                "hidden"
            )
        ){


            modal.classList.add(
                "hidden"
            );


            stopTimer();


        }


    }


}

);
// ============================================
// РЕДАКТОР ВОПРОСОВ
// ============================================


const editorButton =
document.getElementById("editorBtn");


const editorModal =
document.getElementById("editorModal");


const jsonEditor =
document.getElementById("jsonEditor");


const saveJsonButton =
document.getElementById("saveJson");


const downloadJsonButton =
document.getElementById("downloadJson");


const uploadJsonButton =
document.getElementById("uploadJson");


const jsonFile =
document.getElementById("jsonFile");


const closeEditorButton =
document.getElementById("closeEditor");




// Открыть редактор

if(editorButton){


    editorButton.onclick = function(){



        jsonEditor.value =

        JSON.stringify(
            gameData,
            null,
            4
        );



        editorModal.classList.remove(
            "hidden"
        );


    };


}




// Закрыть редактор

if(closeEditorButton){


    closeEditorButton.onclick =
    function(){


        editorModal.classList.add(
            "hidden"
        );


    };


}





// Сохранить изменения

if(saveJsonButton){


    saveJsonButton.onclick =
    function(){


        try{


            gameData =

            JSON.parse(
                jsonEditor.value
            );


            createBoard();


            alert(
                "Вопросы обновлены!"
            );


        }
        catch(error){


            alert(
                "Ошибка в JSON"
            );


        }


    };


}





// Скачать JSON

if(downloadJsonButton){


    downloadJsonButton.onclick =
    function(){


        let data =

        JSON.stringify(
            gameData,
            null,
            4
        );



        let file =

        new Blob(
            [data],
            {
                type:
                "application/json"
            }
        );



        let link =
        document.createElement("a");



        link.href =
        URL.createObjectURL(
            file
        );


        link.download =
        "questions.json";


        link.click();


    };


}





// Загрузка JSON

if(uploadJsonButton){


    uploadJsonButton.onclick =
    function(){


        jsonFile.click();


    };


}





jsonFile.onchange =
function(event){


    let file =
    event.target.files[0];



    if(!file){

        return;

    }



    let reader =
    new FileReader();



    reader.onload =
    function(e){



        try{


            gameData =

            JSON.parse(
                e.target.result
            );



            jsonEditor.value =

            JSON.stringify(
                gameData,
                null,
                4
            );



            createBoard();



            alert(
                "Файл загружен"
            );


        }
        catch(error){


            alert(
                "Некорректный JSON"
            );


        }


    };



    reader.readAsText(file);


};




// ============================================
// АВТОСОХРАНЕНИЕ ПЕРЕД ЗАКРЫТИЕМ
// ============================================


window.addEventListener(
"beforeunload",
function(){


    saveGame();


});
