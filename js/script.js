// Get elements
let next = document.querySelector(".container .footer button.submit");
let qNumber = document.querySelector(".qNumber");
let qCounter = document.querySelector(".qCounter");
let question = document.querySelector(".question");
let answers = document.querySelector(".answers");
let minutes = document.querySelector(".minutes");
let seconds = document.querySelector(".seconds");


let right_answer =  0;

function getQuestions() {
    let myQuestions = new XMLHttpRequest();

    myQuestions.onreadystatechange = function () {

        if(this.readyState === 4 && this.status === 200) { 
            let myObj = JSON.parse(this.responseText); 
            var timer = setInterval(() => {
                seconds.innerHTML = (Number(seconds.innerHTML) + 1);
                if (seconds.innerHTML < 10) seconds.innerHTML = '0' + seconds.innerHTML;
                if (seconds.innerHTML == 60) {
                    seconds.innerHTML = 0;
                    minutes.innerHTML++;
                    if (minutes.innerHTML < 10) minutes.innerHTML = '0' + minutes.innerHTML;
                }
            }, 1000);
        
            qCounter.innerHTML = myObj.length;
            let i = 0;
    
            getContent(question, answers, myObj, i);
            next.addEventListener('click', () => {
                if (qNumber.innerHTML == 10) clearInterval(timer);
                document.querySelectorAll("input[type='radio']").forEach(ele => {
                    if(ele.checked === true) 
                        if(i < myObj.length && ele.value === myObj[i]['correct_answer']) right_answer++;
                })
                i++;
                getContent(question, answers, myObj, i);
            });
        }
    }

    myQuestions.open("GET", "Questions.json", true);
    myQuestions.send();
}
getQuestions();

function getContent(question, answersbox, obj, i) {

    if(i < obj.length) {
        question.innerHTML = obj[i].title;
    
        let specificAnswers = Object.keys(obj[i]).filter(ele => {
            return ele.startsWith('answer');
        });
        answersbox.innerHTML ='';
        for(let j = 0; j < specificAnswers.length; j++) {
            let box = document.createElement('div');
            box.classList = 'box';
            var radiobox = document.createElement('input');
            radiobox.type = 'radio';
            radiobox.name = 'answer';
            radiobox.value = obj[i][specificAnswers[j]];
            radiobox.id = specificAnswers[j];
            if(j==0) radiobox.checked = true;
        
            let label = document.createElement('label')
            label.htmlFor = specificAnswers[j];
            label.innerHTML = obj[i][specificAnswers[j]];

            box.appendChild(radiobox);
            box.appendChild(label);

            answersbox.appendChild(box);
        }
        qNumber.innerHTML++;
    }
    if(i === obj.length)
    {
        document.body.removeChild(document.body.firstElementChild);
        let resultsEle = document.createElement("div");
        resultsEle.className = "results";

        let p = document.createElement("p");
        p.innerHTML = `You get <span>${right_answer}/${obj.length}</span>`;
        
        let btn = document.createElement("button");
        btn.id = "restart";
        btn.type = "submit";
        btn.innerHTML = "Restart";
        
        resultsEle.appendChild(p);
        resultsEle.appendChild(btn);
        
        document.body.appendChild(resultsEle);

        if(right_answer > 8)
            document.querySelector(".results p span").className = "great";
        else if(right_answer  > 5)
            document.querySelector(".results p span").className = "Not_bad";
        else if(right_answer <= 5)
            document.querySelector(".results p span").className = "bad";
        
        document.getElementById("restart").onclick = () => location.reload();
    }
}