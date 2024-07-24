const {generateContent} = require("./ContentGenerator");


// Huxley 1 - Save the future! ChIJN1t_tDeuEmsRUsoyG83frY4
// 'Passeggiate a cavallo', 'ChIJeQKfqWRFKRMR9qsVJSEJ3XI'
// 'Feuerwehr / THW ticket', 'ChIJ37AQjmzuuEcRrmJQV2l7SYw'
// 'Brauereiführung mit Bierprobe im Brauhaus zur Sonne', 'ChIJZchWChhzvEcRlYSgf8zEr14'
generateContent('Biglietto di ingresso','ChIJeQKfqWRFKRMR9qsVJSEJ3XI', 'english')
    .then((content) => {
        console.log("Content: \n", content);
    })
    .catch((error) => {
        console.error(error);
    });
