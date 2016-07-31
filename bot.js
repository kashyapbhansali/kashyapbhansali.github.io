
function answer(question) {
    question = question.toLowerCase();
    var answers = {
        color : "My favorite color is Red",
        name : "My full name is Kashyap Kalpesh Bhansali",
        sex: "Male",
        gender: "Male",
        male: "Male",

        age : "I was born on December 1, 1993... 23 years old",
        old : "I was born on December 1, 1993... 23 years old",
        dob : "I was born on December 1, 1993... 23 years old",

        citizen : "I am from India",
        from : "I am from India",
        nationality : "I am from India",

        live : "I live in USA... Arizona state",

        university: "I am pursuing Master's in Computer Science at Arizona State Univerity",

        intern: "I interned at VMware, Inc.",

        gf: "I call her Sal",
        girlfriend: "I call her Sal",


    };

    var keys = Object.keys(answers);
    var result = "";

    for (var i =0; i<keys.length; i++) {
        if(question.indexOf(keys[i]) !== -1) {
            //alert(answers[keys[i]]);
            //alert("baba");
            result = answers[keys[i]];
            break;
        }
    }

    return result;
}

