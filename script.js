const contenedorPreguntas = document.querySelector('.contenedorPreguntas');
const fragment = document.createDocumentFragment();
const btnRegister = document.querySelector('#btnRegister');
const btnLogin = document.querySelector('#btnLogin');
const btnLogout = document.querySelector('#btnLogout');
const btnExitLogin = document.querySelector('#btnExitLogin');
const btnExitRegister = document.querySelector('#btnExitRegister');
const enviarResultados = document.querySelector('#enviarResultados');
const divLoginContainer = document.querySelector('#divLogin-container');
const divRegisterContainer = document.querySelector('#divRegister-container');

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

        // option1.textContent = element.incorrect_answers[0];
        // option2.textContent = element.incorrect_answers[1];
        // option3.textContent = element.incorrect_answers[2];
        // option4.textContent = element.incorrect_answers[3];
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

getQuestions();

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
                email: user.email
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
        btnFavPrint.style.display = 'none';
        btnAtrasBooks.style.display = 'none';
        btnAtras.style.display = 'flex';
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
const resultado = {
    aciertos: 9,
    score: 80
}

document.addEventListener('click', async (event) => {
    const user = firebase.auth().currentUser;

    if (event.target.matches('#enviarResultados')) {
        console.log('funciona')
        addPuntuación(user.uid, resultado);
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

const addPuntuación = (uid, resultado) => {
    db.collection("quiz").where("id", "==", uid)
        .get()
        .then((docs) => {
            docs.forEach(async (doc) => {
                const docId = doc.id;
                const userRef = db.collection('quiz').doc(docId);

                await userRef.update({ resultados: firebase.firestore.FieldValue.arrayUnion(resultado) })
                    .then(() => {
                        alert('Resultados registrados.')
                    })
                    .catch((error) => {
                        throw `Error registrando la puntuación: ${error}`;
                    });
            });
        })
        .catch((error) => {
            alert(error);
        });
};

