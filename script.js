const getQuestions = async () => {
    try {
        const resp = await fetch('https://opentdb.com/api.php?amount=10');

        if (resp.ok) {
            const data = await resp.json();
            console.log(data);

        } else {
            throw resp;
        }

    } catch (error) {
        throw console.log(error.status);
    }
};

getQuestions();