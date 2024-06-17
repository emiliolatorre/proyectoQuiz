//VARIABLES
const contenedorPreguntas = document.querySelector('.contenedorPreguntas');
const contenedorResultados = document.querySelector('.contenedorResultados');
const triggerQuestionsBtn = document.querySelector('.triggerQuestionsBtn');
const loginContainer = document.querySelector('.loginContainer');
const signupContainer = document.querySelector('.signupContainer');
const signUpForm = document.getElementById('signUpForm');
const loginForm = document.getElementById('loginForm');
const fragment = document.createDocumentFragment();
// variables para guardar resultados
let questionsArrayGlobal;
let iteratingIndex = 0;
let correctAnswersArray = []; //vaciar cuando iteratingIndex === 10;
let resultPerGameObj = {
    scoreJuego: 0, //reset cuando iteratingIndex === 10;
    fechaJuego: new Date().toDateString()
};
let resultados = [];


//EVENTOS
document.addEventListener('click', ({ target }) => {
    if (target.matches('.optionBtn')) {
        const valueOption = target.value;
        validarRespuestaCorrecta(valueOption);
        clearComponent(contenedorPreguntas);
        pintarQuestions(questionsArrayGlobal, iteratingIndex + 1);
        ++iteratingIndex;
        if (iteratingIndex === 10) {
            correctAnswersArray = [];
            pushResultsToLocal(resultPerGameObj);
        }
    }

    if (target.matches('.goToLogin')) {
        loginContainer.classList.add('show');
    }

    if (target.matches('.goToRegister')) {
        signupContainer.classList.add('show');
    }

    if (target.matches('.closeFormBtn')) {
        loginContainer.classList.remove('show');
        signupContainer.classList.remove('show');

    }
});

//FUNCIONES
const getQuestions = async () => {
    try {
        const resp = await fetch('https://opentdb.com/api.php?amount=10');

        if (resp.ok) {
            const data = await resp.json();
            const questionsArray = data.results;
            questionsArray.forEach(element => {
                correctAnswersArray.push(element.correct_answer);
            });
            console.log(questionsArray);
            console.log(correctAnswersArray);
            questionsArrayGlobal = questionsArray;
            pintarQuestions(questionsArray, 0);
        } else {
            throw resp;
        }

    } catch (error) {
        throw console.log(error.status);
    }
};

const pintarQuestions = (arr, index) => {
    if (index === 10) {
        clearComponent(contenedorPreguntas);
        const resultsLink = document.createElement('a');
        const goToResultsBtn = document.createElement('button');
        goToResultsBtn.classList.add('goToResultsBtn');
        resultsLink.href = '/pages/results.html';
        resultsLink.append(goToResultsBtn);
        goToResultsBtn.textContent = 'Comprueba tu puntuación!'
        fragment.append(resultsLink);
        contenedorPreguntas.append(fragment);
    } else {
        const card = document.createElement('article');
        card.classList.add('cardPreguntas')
        const contenedorOptions = document.createElement('div');
        contenedorOptions.setAttribute('id', 'contenedorOptions')
        const question = document.createElement('h4');
        const category = document.createElement('h5');
        question.textContent = `${index + 1}. ${decodeHTML(arr[index].question)}`;
        category.textContent = `${decodeHTML(arr[index].category)}`;
        const incorrectAnswersArr = arr[index].incorrect_answers;
        shuffle(incorrectAnswersArr, arr[index].correct_answer);
        const allAnswers = arr[index].incorrect_answers;
        allAnswers.forEach((element, index) => {
            const option = document.createElement('button');
            option.textContent = decodeHTML(element);
            option.value = element;
            option.classList.add('optionBtn');
            if (index === 0) option.classList.add('option1');
            if (index === 1) option.classList.add('option2');
            if (index === 2) option.classList.add('option3');
            if (index === 3) option.classList.add('option4');
            contenedorOptions.append(option);
        });
        card.append(question, category, contenedorOptions);
        fragment.append(card);
        contenedorPreguntas.append(fragment);
    }
};

const pintarResults = () => {
    const results = JSON.parse(localStorage.getItem('resultados')) || [];
    const scoreContainer = document.createElement('article');
    const textAndPlayAgainContainer = document.createElement('article');
    const score = document.createElement('p');
    const text = document.createElement('h3');
    const questionsLink = document.createElement('a');
    const playAgaingBtn = document.createElement('button');
    const indexLink = document.createElement('a');
    const goToIndexgBtn = document.createElement('button');
    score.textContent = `${results[results.length - 1].scoreJuego}/10`;
    questionsLink.href = '/pages/questions.html';
    playAgaingBtn.textContent = 'Play Again!';
    indexLink.href = '/index.html';
    goToIndexgBtn.textContent = 'Home';
    questionsLink.append(playAgaingBtn);
    indexLink.append(goToIndexgBtn);
    variarMensajeResultado(text);
    scoreContainer.append(score);
    textAndPlayAgainContainer.append(text, questionsLink, indexLink);
    contenedorResultados.append(scoreContainer, textAndPlayAgainContainer);
};

const shuffle = (arr, correctAnswer) => {
    const random = Math.floor(Math.random() * arr.length);
    return arr.splice(random, 0, correctAnswer);
};

const clearComponent = (component) => {
    component.innerHTML = '';
};

const validarRespuestaCorrecta = (value) => {
    const correcto = correctAnswersArray.find(element => element === value);
    if (correcto) resultPerGameObj.scoreJuego += 1;
};

const pushResultsToLocal = (resultado) => {
    const local = localStorage.getItem('resultados');
    const resultados = local ? JSON.parse(local) : [];
    resultados.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(resultados));
};

const variarMensajeResultado = (componente) => {
    const results = JSON.parse(localStorage.getItem('resultados')) || [];
    if (results[0].scoreJuego <= 4) componente.textContent = 'Espabila';
    if (results[0].scoreJuego > 4 && results[0].scoreJuego <= 7) componente.textContent = 'No te lo tengas tan creído';
    if (results[0].scoreJuego > 7) componente.textContent = 'Todos podemos tener un día de suerte';
};

const decodeHTML = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
};

getQuestions();
pintarResults();

