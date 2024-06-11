const contenedorPreguntas = document.querySelector('.contenedorPreguntas');
const fragment = document.createDocumentFragment();

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
    arr.forEach((element, index)=> {
        const card = document.createElement('article');
        const contenedorOptions = document.createElement('div');
        const question = document.createElement('h4');
        const category = document.createElement('h5');
        const option1 = document.createElement('button'); 
        const option2 = document.createElement('button');
        const option3 = document.createElement('button');
        const option4 = document.createElement('button');
        const next = document.createElement('button');
        (option1, option2, option3, option4).classList.add('respuestaBtn');
        next.classList.add('nextBtn');
        question.textContent = `${index + 1}. ${element.question}`;
        category.textContent = element.category;
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








//****** AUTHENTICATION ******

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
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            // Saves user in firestore
            createUser({
                id: user.uid,
                email: user.email
            });
            //(BOTONESLOGIN/REGISTER).classList.remove('show')

        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
};

document.getElementById("formRegister").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;

    pass === pass2 ? signUpUser(email, pass) : alert("error password");
});

const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`);
            console.log("USER", user);
            //(BOTONESLOGIN/REGISTER).classList.remove('show')
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

document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass)
});

document.getElementById("salir").addEventListener("click", function (event) {
    signOut();
    titleLista.innerHTML = '';
    containerListas.innerHTML = '';
    sectionFiltrosIndex.style.display = 'flex';
    sectionFiltrosBooks.style.display = 'none';
    currentPage = 1;
    divPage.style.display = 'none'
    getIndex(`${urlIndex}`)
        .then((resp) => {
            const indexArray = resp.results
            printIndex(indexArray)
        })
        .catch((error) => { console.error(error) })
});

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        document.getElementById("message").innerText = `¡Bienvenido ${user.email}!`;

        btnFavPrint.style.display = 'flex'

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

document.addEventListener('click', async (event) => {
    const user = firebase.auth().currentUser;

    if (event.target.classList.contains('btnFav')) {

        if (user) {
            const bookData = JSON.parse(event.target.id);
            addBookFav(user.uid, bookData);
            event.target.classList.remove('btnFav');
            event.target.classList.add('btnFav2');
            event.target.querySelector('img').src = 'assets/favorito2.png';

        } else {
            divLoginContainer.classList.add('show');
        }

    } else if (event.target.classList.contains('btnFav2')) {
        if (user) {
            const bookData = JSON.parse(event.target.id);
            removeBookFav(user.uid, bookData);
            event.target.classList.remove('btnFav2');
            event.target.classList.add('btnFav');
            event.target.querySelector('img').src = 'assets/favorito.png';
        } else {
            divLoginContainer.classList.add('show');
        }
    }
});




//****** FIRESTORE DB ******
// Almacena la puntuación de cada partida en Firebase Firestore. Guardar puntuación y fecha en cada objeto
/* Modelo de datos:
- collection: puntuaciones
- documento: cada usuario
- data: [
{
nombre:
email:
puntuaciones: [
{puntuación: correct, incorrect, correct, incorrect, correct, correct, incorrect, correct, incorrect, correct},
{puntuación2},
{puntuación3}
]
*/

const addPuntuación = (uid, puntuacion) => {
    db.collection("quiz").where("id", "==", uid)
        .get()
        .then((docs) => {
            docs.forEach(async (doc) => {
                const docId = doc.id;
                const userRef = db.collection('quiz').doc(docId);

                await userRef.update({ puntuaciones: firebase.firestore.FieldValue.arrayUnion(puntuacion) })
                    .then(() => {
                        alert('Puntuación registrada.')
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


// Evento

document.addEventListener('click', async (event) => {
    if (event.target.matches('#btnFavPrint')) {
        const user = firebase.auth().currentUser;
        db.collection("users").where("id", "==", user.uid)
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    const dataBooksToPrint = doc.data().favourites;
                    printBooksFiltered(dataBooksToPrint)
                })
            })
        btnAtrasBooks.style.display = 'flex';
        btnAtras.style.display = 'none';

        formTitulo.style.display = 'none';
        formAutor.style.display = 'none';
        selectAZAutor.style.display = 'none';

        currentPage = 1;
    }
});

