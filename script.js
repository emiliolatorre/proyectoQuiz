const contenedorPreguntas = document.querySelector('.contenedorPreguntas');
const fragment = document.createDocumentFragment();
const rightAudio = new Audio('assets/RightAudio.ogg');
const wrongAudio = new Audio('assets/WrongAudio.ogg');

/* 

const getQuestions = async () => {
    try {
        const resp = await fetch('https://opentdb.com/api.php?amount=10');

        if (resp.ok) {
            const data = await resp.json();
            console.log(data.results);
            const questionsArray = data.results;
            pintarQuestions(questionsArray);
        } else {
            throw resp;
        }

    } catch (error) {
        throw console.log(error.status);
    }
};

const pintarQuestions = (arr) => {
    arr.forEach((element, index) => {
        const card = document.createElement('article');
        //esto
        card.classList.add('cardPreguntas')
        const contenedorOptions = document.createElement('div');
        contenedorOptions.setAttribute('id', 'contenedorOptions')
        const question = document.createElement('h4');
        const category = document.createElement('h5');
        const option1 = document.createElement('button');
        //
        option1.classList.add('option1', 'respuestaBtn')
        const option2 = document.createElement('button');
        //
        option2.classList.add('option2', 'respuestaBtn')
        const option3 = document.createElement('button');
        //
        option3.classList.add('option3', 'respuestaBtn')
        const option4 = document.createElement('button');
        //
        option4.classList.add('option4', 'respuestaBtn')
        const next = document.createElement('button');
        next.textContent = 'Next' //
        next.classList.add('nextBtn')// 
        //(option1, option2, option3, option4).classList.add('respuestaBtn');
        next.classList.add('nextBtn');
        question.textContent = `${index + 1}. ${element.question}`;
        category.textContent = element.category;
        const incorrectAnswersArr = element.incorrect_answers;
        shuffle(incorrectAnswersArr, element.correct_answer);
        console.log(element.incorrect_answers);

        option1.textContent = element.incorrect_answers[0];
        option2.textContent = element.incorrect_answers[1];
        option3.textContent = element.incorrect_answers[2];
        option4.textContent = element.incorrect_answers[3];

        contenedorOptions.append(option1, option2, option3, option4);
        card.append(question, category, contenedorOptions, next);
        fragment.append(card);
    });
    contenedorPreguntas.append(fragment);
};

const shuffle = (arr, correctAnswer) => {
    const random = Math.floor(Math.random() * arr.length);
    return arr.splice(random, 0, correctAnswer);
};

 */
//Grafica de resultados


const pintarGraficaResults = async () => {
    const grafica = document.getElementById('graficaResultados').getContext('2d');

    let results = JSON.parse(localStorage.getItem('resultados')) || [];
    fechaJuego = [];
    scoreJuego = [];

    results.forEach((element)=>{
        fechaJuego.push(element.fechaJuego)
        scoreJuego.push(element.scoreJuego)
    })
    new Chart(grafica, {
        type: 'line',
        data: {
            labels: fechaJuego,
            datasets: [{
                label: 'Your Stats',
                data: scoreJuego,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded',()=>{
    pintarGraficaResults();
})  



document.addEventListener('DOMContentLoaded', () => {
    const volumen = document.querySelector('.volumen');
    const musicaFondo = document.querySelector('.musicaFondo');
    musicaFondo.play()
    volumen.addEventListener('click', () => {
        if (musicaFondo.paused) {
            musicaFondo.play()
        } else {
            musicaFondo.pause();
        }
    });
});
getQuestions();
pintarQuestions();