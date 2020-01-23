let a = ''; //store first entered number
let b = ''; //store second number
let ans;  //store last answer
let eventSaver; //Store last event when needed
let operator; //store operator
let previousAnswer;

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

/*const createHistoryElement = (num, sign = '') => {
    history.textContent = '';
    let span = document.createElement('span');
    span.setAttribute('class', 'history-child');
    span.appendChild(document.createTextNode(`${num} ${sign}`));
    history.appendChild(span);
}*/
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
    concat = parseFloat(concat, 10)/*.toFixed(2)*/;
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

const numCompressor = (prev) => {
    history.textContent = `${prev} ${operator} ${b} =`
    if (history.textContent.length >= 21) {
        let arr = [prev, b];
        let index;
        if (arr[0] >= arr[1]) {
            arr[0] = arr[0].toExponential(2);
            history.textContent = `${arr[0]} ${operator} ${arr[1]} =`;
            index = 1;
        }
        else {
            arr[1] = arr[1].toExponential(2);
            history.textContent = `${arr[0]} ${operator} ${arr[1]} =`;
            index = 0;
        }
        if (history.textContent.length >= 21) {
            arr[index] = arr[index].toExponential(2);
            history.textContent = `${arr[0]} ${operator} ${arr[1]} =`
        } 
    }
}

//displays answer in currentText element
const setAns = () => {
    if (ans / 1000000000000 >= 1) { ans = ans.toExponential(2) }
    if (eventSaver === '=') {
        history.textContent = `${currentText.textContent} ${operator}`
    } 
    currentText.textContent = '';
    createAnswerElement(ans.toString());
    if (eventSaver === 'chain') {
        history.textContent += ` ${b}`;
    } else {
        history.textContent += ` ${b} = ${ans}`;
    }
    if (history.textContent.length >= 19) {
        if (eventSaver === 'chain') {
            history.textContent = `${ans}`;
        } else if (eventSaver === '=') { 
            numCompressor(previousAnswer);
        } else {
            numCompressor(a);
        }
    } 
}

//evalutes given equation
const evaluate = () => {
    previousAnswer = ans;
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

/*allows chain calculations e.g. 2 x 3 x 5 while displaying each answer as more 
numbers and operators are entered*/
const chainCalculate = () => {
    eventSaver = 'chain';
    evaluate();
    operator = event.target.textContent;
    a = ans;
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num") && currentText.childElementCount < 11) {
        if (eventSaver === '=') {
            currentText.textContent = '';
            eventSaver = '';
            a = '';
        } else if (eventSaver === 'chain') {
            currentText.textContent = '';
            eventSaver = 'operator';
        }
        if (event.target.textContent !== '.' && currentText.textContent === '0') {
            currentText.textContent = '';
            createOperandElement(event);
        } else if (event.target.matches('.zero')) {
            if (currentText.textContent === '') {
                createOperandElement(event);
            }
        } else { createOperandElement(event); }
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
                history.textContent += ' x';
            } else {
                setVar(event.target.textContent);
                history.textContent = `${a.toString()} x`;
            }
        } else if (event.target.matches('.add')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                history.textContent += ' +';
            } else {
                setVar(event.target.textContent);
                history.textContent = `${a.toString()} +`;
            }
        } else if (event.target.matches('.subtract')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                history.textContent += ' -';
            } else {
                setVar(event.target.textContent);
                history.textContent = `${a.toString()} -`;
            }
        } else if (event.target.matches('.divide')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
                history.textContent += ' /';
            } else {
                setVar(event.target.textContent);
                history.textContent = `${a.toString()} /`;
            }
        } else if (event.target.matches('.equals') && a !== '' && currentText.textContent !== '' && eventSaver !== 'chain') {
            evaluate();
            eventSaver = '=';
        }
    }
})