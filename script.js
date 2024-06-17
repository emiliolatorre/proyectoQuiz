//VARIABLES
const contenedorPreguntas = document.querySelector('.contenedorPreguntas');
const contenedorResultados = document.querySelector('.contenedorResultados');
const triggerQuestionsBtn = document.querySelector('.triggerQuestionsBtn');
const loginContainer = document.querySelector('.loginContainer');
const signupContainer = document.querySelector('.signupContainer');
const signUpForm = document.getElementById('signUpForm');
const loginForm = document.getElementById('loginForm');
const fragment = document.createDocumentFragment();
const btnRegister = document.querySelector('#btnRegister');
const btnLogin = document.querySelector('#btnLogin');
const btnLogout = document.querySelector('#btnLogout');
const btnExitLogin = document.querySelector('#btnExitLogin');
const btnExitRegister = document.querySelector('#btnExitRegister');
const enviarResultados = document.querySelector('#enviarResultados');
const divLoginContainer = document.querySelector('#divLogin-container');
const divRegisterContainer = document.querySelector('#divRegister-container');

const rightAudio = new Audio('assets/RightAudio.ogg');
const wrongAudio = new Audio('assets/WrongAudio.ogg');
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
/*

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

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuLH-B5suV6RhxfnuTiEGwZkXW4aGSVz8",
    authDomain: "fir-demo-e0698.firebaseapp.com",
    projectId: "fir-demo-e0698",
    storageBucket: "fir-demo-e0698.appspot.com",
    messagingSenderId: "596752096583",
    appId: "1:596752096583:web:46008be2c6fcbef2508062"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
const db = firebase.firestore();// db representa mi BBDD //inicia Firestore
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();


//****** AUTHENTICATION ******

document.addEventListener('click', (event) => {

    if (event.target.matches('#btnRegister')) {
        divRegisterContainer.classList.add('show');
    }

    if (event.target.matches('#btnExitRegister')) {
        divRegisterContainer.classList.remove('show')
    }

    if (event.target.matches('#btnLogin')) {
        divLoginContainer.classList.add('show');
    }

    if (event.target.matches('#btnExitLogin')) {
        divLoginContainer.classList.remove('show')
    }

    if (event.target.matches('#linkRegister')) {
        divLoginContainer.classList.remove('show');
        divRegisterContainer.classList.add('show');
    }

    if (event.target.matches('#btnLogout')) {
        signOut();
        // Stats.style.display = 'none';
        // Score.style.display = 'none';
    }
});

document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass)
});

document.getElementById("formRegister").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;

    pass === pass2 ? signUpUser(email, pass) : alert("error password");
});

const createUser = (user) => {
    db.collection("quiz")
        .add(user)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => console.error("Error adding document: ", error));
};

const signUpUser = (email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            createUser({
                id: user.uid,
                email: user.email,
                resultados: []
            });
            divRegisterContainer.classList.remove('show')

        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
};

const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`);
            console.log("USER", user);
            divLoginContainer.classList.remove('show');
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
};

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email);
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
};

// Listener de usuario en el sistema
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        document.getElementById("message").innerText = `¡Bienvenido ${user.email}!`;

        divLogout.style.display = 'block'
        btnRegister.style.display = 'none'
        btnLogin.style.display = 'none'

    } else {
        console.log("no hay usuarios en el sistema");
        document.getElementById("message").innerText = ``;

        divLogout.style.display = 'none'
        btnRegister.style.display = 'block'
        btnLogin.style.display = 'block'
    }
});

// resultado de prueba
const nuevoResultado = {
    fecha: '2024-05-15',
    aciertos: 5,
}

document.addEventListener('click', async (event) => {
    const user = firebase.auth().currentUser;

    if (event.target.matches('#enviarResultados')) {
        console.log('funciona')
        addPuntuación(user.uid, nuevoResultado);
        console.log('funciona2')
    }

    // TODO crear botones para ver stats y score (solo visibles cuando user logeado), e incluir evento
    // else if (event.target.classList.contains('btnStats')) {

    //     if (user) {
    //         pintarStats()

    //     } else {
    //     }

    // } else if (event.target.classList.contains('btnScores')) {
    //     if (user) {
    //         pintarScore()
    //     } else {
    //     }
    // }
});

//****** FIRESTORE DB ******

const addPuntuación = (uid, nuevoResultado) => {
    db.collection("quiz").where("id", "==", uid)
        .get()
        .then((docs) => {
            docs.forEach(async (doc) => {
                const docId = doc.id;
                const userRef = db.collection('quiz').doc(docId);

                try {
                    // Leer el documento actual
                    const docSnapshot = await userRef.get();
                    const datos = docSnapshot.data();
                    const resultados = datos.resultados || [];

                    // Agregar el nuevo resultado al array
                    resultados.push(nuevoResultado);

                    // Actualizar el array en Firestore
                    await userRef.update({ resultados: resultados });
                    alert('Resultados registrados.');
                } catch (error) {
                    console.error(`Error registrando la puntuación: ${error}`);
                }
            })
        })
        .catch((error) => {
            alert(error);
        });
};

const loginGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            // Esto te da un token de acceso a Google.
            const token = result.credential.accessToken;
            // La información del usuario registrado.
            const user = result.user;
            console.log("Usuario logado con Google:", user);
            divLoginContainer.classList.remove('show');
        divRegisterContainer.classList.remove('show');
        }).catch((error) => {
            // Manejo de errores.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = error.credential;
            console.error(`Error en login con Google: ${errorCode}, ${errorMessage}`);
        });
};

// no esta terminada, en proceso.
// const getMayoresResultados = () => {
//     const tableTitulo = document.createElement ('h3');
//     tableTitulo.innerHTML = 'TOTAL SCORE RANKING';

//     const table = document.createElement('table');
//     table.id = 'tableScore';

//     const tHead = document.createElement('thead');

//     const trHead = document.createElement('tr');
//     const th1 = document.createElemenet('th');
//     th1.textContent = 'RANK';

//     const th2 = document.createElemenet('th');
//     th2.textContent = 'SCORE';


//     const th3 = document.createElemenet('th');
//     th3.textContent = 'NAME';

//     const th4 = document.createElemenet('th');
//     th4.textContent = 'COUNT';

//     const tbody = document.createElement('tbody');
// }

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