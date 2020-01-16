let a = ''; //store first entered number
let b = ''; //store second number
let ans;  //store last answer
let eventSaver; //Store last event when needed
let operator; //store operator

//html element where numbers entered are displayed
const currentText = document.getElementById("current-text");
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
        eventSaver = 'operator';
        operator = op;
        a = parseEntry();
        currentText.textContent = '';
    } else { operator = op }
}

//displays answer in currentText element
const setAns = () => {
    currentText.textContent = '';
    createAnswerElement(ans.toString());
    eventSaver = event.target.textContent; //To clear stored variables if a number is entered directly after an answer is given
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
            if (eventSaver === '=') { ans -= b; }
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
    evaluate();
    a = ans;
    eventSaver = 'chain';
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num")) {
        if (eventSaver === '=') {
            currentText.textContent = ''
            eventSaver = ''
            a = '';
        } else if (eventSaver === 'chain') {
            currentText.textContent = '';
        }
        createOperandElement(event);
    } else if (event.target.matches('.clear-all')) {
        currentText.textContent = '';
        a = '';
        //b = '';
        //ans = '';
        //operator = '';
    } else if (currentText.textContent !== '' || eventSaver === 'operator') {
        if (event.target.matches('.back-space') && eventSaver !== '=') {
            backSpace();
        } else if (event.target.matches('.clear')) {
            currentText.textContent = '';
        } else if (event.target.matches('.multiply')) {
            if (a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
            } else { setVar(event.target.textContent); }
        } else if (event.target.matches('.add')) {
            if (a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
            } else { setVar(event.target.textContent); }
        } else if (event.target.matches('.subtract')) {
            if (a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
            } else { setVar(event.target.textContent); }
        } else if (event.target.matches('.divide')) {
            if (a !== '' && currentText.firstChild.matches('.operand')) {
                chainCalculate();
            } else { setVar(event.target.textContent); }
        } else if (event.target.matches('.equals') && a !== '' && currentText.textContent !== '') {
            evaluate();
        }
    }
})