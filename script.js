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
        //esto
        card.classList.add('cardPreguntas')
        const contenedorOptions = document.createElement('div');
        contenedorOptions.setAttribute('id', 'contenedorOptions')
        const question = document.createElement('h4');
        const category = document.createElement('h5');
        const option1 = document.createElement('button'); 
        //
        option1.classList.add('option1','respuestaBtn')
        const option2 = document.createElement('button');
        //
        option2.classList.add('option2','respuestaBtn')
        const option3 = document.createElement('button');
        //
        option3.classList.add('option3','respuestaBtn')
        const option4 = document.createElement('button');
        //
        option4.classList.add('option4','respuestaBtn')
        const next = document.createElement('button');
        next.textContent='Next' //
        next.classList.add('nextBtn')// 
        //(option1, option2, option3, option4).classList.add('respuestaBtn');
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