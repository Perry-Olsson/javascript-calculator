let a = ''; //store first entered number
let b = ''; //store second number
let ans;  //store last answer
let eventSaver; //Store last event when needed
let operator; //store operator

//html element where numbers entered are displayed
const currentText = document.getElementById("current-text");
const history = document.getElementById('history');
currentText.textContent = ''

//creates and displays (in currentText element) an element when a digit or decimal is pressed
const createOperandElement = (event) => {
    let span = document.createElement("span");
    span.setAttribute('class', 'operand selector');
    span.appendChild(document.createTextNode(event.target.textContent))
    currentText.appendChild(span);
}

//creates and displays and element for an answer to a calculation
//different class from previous function so that backspace funciton doesn't work on it
const createAnswerElement = (answer) => {
    let span = document.createElement('span');
    span.setAttribute('class', 'answer selector');
    span.appendChild(document.createTextNode(answer));
    currentText.appendChild(span);
}

const createHistoryElement = (num, sign = '') => {
    history.textContent = '';
    let span = document.createElement('span');
    span.setAttribute('class', 'history-child');
    span.appendChild(document.createTextNode(`${num} ${sign}`));
    history.appendChild(span);
}
//deletes most recently entered digit or decimal point
const backSpace = () => {
    let temp1 = document.querySelectorAll('.operand');
    temp1[temp1.length - 1].remove();    
}

//turns entry into a number to be operated on
const parseEntry = () => {
    let temp = document.querySelectorAll('.selector');
    let concat = ''
    for (item of temp) {
        concat += item.textContent;
    }
    concat = parseFloat(concat, 10);
    return concat
}

//saves first entry and/or operator when an operator key is pressed
const setVar = (op) => {
    if (currentText.textContent !== '') {
        if (currentText.firstChild.matches('.answer') && eventSaver === 'chain') {
            operator = op
        } else {
            eventSaver = 'operator';
            operator = op;
            a = parseEntry();
            currentText.textContent = '';
        }
    } else { operator = op }
}

//displays answer in currentText element
const setAns = () => {
    if (ans / 1000000000000 >= 1) { ans = ans.toExponential(2) }
    if (eventSaver === '=') {
        history.firstChild.textContent = `${currentText.textContent} ${operator}`
    } 
    currentText.textContent = '';
    createAnswerElement(ans.toString());
    if (history.textContent.length >= 23) {
        history.firstChild.textContent = `${currentText.textContent}`;
    } else if (eventSaver === 'chain') {
        history.firstChild.textContent += ` ${b}`;
    } else {
        history.firstChild.textContent += ` ${b} = ${ans}` //To clear stored variables if a number is entered directly after an answer is given
    }
}

//evalutes given equation
const evaluate = () => {
    switch (operator) {
        case 'x':
            if (eventSaver === '=') { ans *= b; }
            else {
                b = parseEntry();
                ans = a * b
            }
            setAns();
            break;
        case '+':
            if (eventSaver === '=') { ans += b; }
            else {
                b = parseEntry();
                ans = a + b;
            }
            setAns();
            break;
        case '-':
            if (eventSaver === '=') {
                ans -= b;
            }
            else {
                b = parseEntry();
                ans = a - b;
            }
            setAns();
            break;//
        case '/':
            if (eventSaver === '=') { ans /= b; }
            else {
                b = parseEntry();
                ans = a / b;
            }
            setAns();
            break;//
    }
}

//allows chain calculations e.g. 2 x 3 x 5 while displaying each answer as more 
//numbers and operators are entered
const chainCalculate = () => {
    eventSaver = 'chain';
    evaluate();
    operator = event.target.textContent;
    a = ans;
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num") && currentText.childElementCount < 12) {
        if (eventSaver === '=') {
            currentText.textContent = ''
            eventSaver = ''
            a = '';
        } else if (eventSaver === 'chain') {
            currentText.textContent = '';
            eventSaver = 'operator'
        }
        createOperandElement(event);
    } else if (event.target.matches('.clear-all')) {
        history.textContent = '';
        currentText.textContent = '';
        a = '';
    } else if (currentText.textContent !== '' || eventSaver === 'operator') {
        if (event.target.matches('.back-space') && eventSaver !== '=') {
            backSpace();
        } else if (event.target.matches('.clear') && currentText.firstChild.matches('.operand')) {
            currentText.textContent = '';
        } else if (event.target.matches('.multiply')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                document.querySelector('.history-child').textContent += ' x';
            } else {
                setVar(event.target.textContent);
                createHistoryElement(a.toString(), 'x');
            }
        } else if (event.target.matches('.add')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                document.querySelector('.history-child').textContent += ' +';
            } else {
                setVar(event.target.textContent);
                createHistoryElement(a.toString(), '+');
            }
        } else if (event.target.matches('.subtract')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                document.querySelector('.history-child').textContent += ' -';
            } else {
                setVar(event.target.textContent);
                createHistoryElement(a.toString(), '-');
            }
        } else if (event.target.matches('.divide')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                document.querySelector('.history-child').textContent += ' /';
            } else {
                setVar(event.target.textContent);
                createHistoryElement(a.toString(), '/');
            }
        } else if (event.target.matches('.equals') && a !== '' && currentText.textContent !== '' && eventSaver !== 'chain') {
            evaluate();
            eventSaver = '=';
        }
    }
})