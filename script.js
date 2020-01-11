let a = ''; //store first entered number
let b = '';
let ans;  //store second number
let eventSaver;
let operator;
const currentText = document.getElementById("current-text");
currentText.textContent = ''

const createOperandElement = (event) => {
    let span = document.createElement("span");
    span.setAttribute('class', 'operand selector');
    span.appendChild(document.createTextNode(event.target.value))
    currentText.appendChild(span);
}

const createAnswerElement = (answer) => {
    let span = document.createElement('span');
    span.setAttribute('class', 'answer selector');
    span.appendChild(document.createTextNode(answer));
    currentText.appendChild(span);
}

const backSpace = () => {
    let temp = document.querySelectorAll('.operand');
    const lastChildIndex = temp.length - 1;
    temp[lastChildIndex].parentNode.removeChild(temp[lastChildIndex]);
}

const parseEntry = () => {
    let temp = document.querySelectorAll('.selector');
    let concat = ''
    for (item of temp) {
        concat += item.textContent;
    }
    concat = parseFloat(concat, 10);
    return concat
}

const setVar = (op) => {
    eventSaver = '';
    operator = op;
    a = parseEntry();
    currentText.textContent = '';
}

const setAns = () => {
    currentText.textContent = '';
    createAnswerElement(ans);
    eventSaver = event.target.textContent; //To clear stored variables if a number is entered directly after an answer is given
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num")) {
        if (eventSaver === '=') {
            currentText.textContent = ''
            eventSaver = ''
            a = '';
        }
        createOperandElement(event);
    } else if (event.target.matches('.clear-all')) {
        currentText.textContent = '';
        a = '';
        b = '';
        ans = '';
        operator = '';
    } else if (event.target.matches('.back-space')) {
        backSpace();
    } else if (currentText.textContent !== '') {
        if (event.target.matches('.multiply')) {
            setVar(event.target.value);
        } else if (event.target.matches('.add')) {
            setVar(event.target.value);
        } else if (event.target.matches('.subtract')) {
            setVar(event.target.value);
        } else if (event.target.matches('.divide')) {
            setVar(event.target.value);
        } else if (event.target.matches('.equals') && a !== '') {
            switch (operator) {
                case '*':
                    ans = (a * parseEntry()).toString();
                    setAns();
                    break;
                case '+':
                    ans = (a + parseEntry()).toString();
                    setAns();
                    break;
                case '-':
                    if (eventSaver === '=') { ans -= b; }
                    else {
                        b = parseEntry();
                        ans = (a - b).toString();
                    }
                    setAns();
                    break;//
                case '/':
                    if (eventSaver === '=') { ans /= b; }
                    else {
                        b = parseEntry();
                        ans = (a / b).toString();
                    }
                    setAns();
                    break;//
            }
        }
    }
})