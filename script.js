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
const createOperandElement = (text) => {
    let span = document.createElement("span");
    span.setAttribute('class', 'operand selector');
    span.appendChild(document.createTextNode(text))
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
            if (eventSaver === '=') { a = ans }
            else { a = parseEntry(); }
            eventSaver = 'operator';
            operator = op;
            currentText.textContent = '';
        }
    } else { operator = op }
}

const numCompressor = () => {
    if (history.textContent.length >= 21) {
        history.textContent = `${a} ${operator} ${b} =`;
    }
    if (history.textContent.length >= 21) {
        let arr = [a, b];
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
const setAns = (op) => {
    if (eventSaver === '=' && operator !== '**') {
        history.textContent = `${currentText.textContent} ${operator}`
    } 
    if (eventSaver === 'chain' && currentText.firstChild.matches('.operand')) {
        history.textContent += ` ${b}`;
    } else if (operator === '**' && eventSaver !== 'operator' || operator !== '**' && eventSaver === '**') { 
        history.textContent += ` = ${ans}`;
    } else if (operator !== '**' && eventSaver !== 'chain') {
        history.textContent += ` ${b} = ${ans}`;
    }
    if (history.textContent.length >= 19) {
        if (eventSaver === 'chain') {
            history.textContent = `${ans}`;
            numCompressor();
        } else if (operator === '**') { 
            history.textContent = `${a} ${op} ${currentText.textContent}**2`;
            numCompressor();            
        } else {
            history.textContent = `${a} ${operator} ${b} = ${ans}`
            numCompressor();
        }
    } 
    currentText.textContent = '';
    if (ans.toString().length > 11) {
        if (ans / 100000000 < 1) {
            createAnswerElement(ans.toFixed(2));
        } else {
            createAnswerElement(ans.toExponential(2));
        }
    }
    else { createAnswerElement(ans.toString()); }
}

//evalutes given equation
const evaluate = (op) => {
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
        case '**':
            ans = parseEntry() ** 2;
            setAns(op);
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
        if (eventSaver === '=' || eventSaver === '**') {
            currentText.textContent = '';
            history.textContent = '';
            eventSaver = '';
            a = '';
        } else if (eventSaver === 'chain') {
            currentText.textContent = '';
            eventSaver = 'operator';
        }
        if (event.target.textContent !== '.' && currentText.textContent === '0') {
            currentText.textContent = '';
            createOperandElement(event.target.textContent);
        } else if (event.target.matches('.zero')) {
            if (currentText.textContent === '' || currentText.firstChild.textContent !== '0' || currentText.textContent.indexOf('.') !== -1) {
                createOperandElement(event.target.textContent);
            }
        } else if (event.target.matches('.decimal')) {
            if (currentText.textContent === '') {
                createOperandElement('0');
            }
            if (currentText.textContent.indexOf('.') === -1) {
                createOperandElement(event.target.textContent);
            }
        } else { createOperandElement(event.target.textContent); }
    } else if (event.target.matches('.clear-all')) {
        history.textContent = '';
        currentText.textContent = '';
        a = '';
        eventSaver = '';
    } else if (currentText.textContent !== '' || eventSaver === 'operator') {
        if (currentText.textContent !== '' && event.target.matches('.back-space') && currentText.firstChild.matches('.operand')) {
            backSpace();
        } else if (currentText.textContent !== '' && event.target.matches('.clear') && currentText.firstChild.matches('.operand')) {
            currentText.textContent = '';
        } else if (event.target.matches('.multiply')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand') || eventSaver === '**' && operator !== '**') {
                chainCalculate();
                history.textContent += ' x';
            } else {
                if (eventSaver === 'chain') {
                    history.textContent = history.textContent.slice(0, -1) + 'x';
                } else {
                    setVar(event.target.textContent);
                    history.textContent = `${a.toString()} x`;
                }
            }
        } else if (event.target.matches('.add')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand') || eventSaver === '**' && operator !=='**') {
                chainCalculate();
                history.textContent += ' +';
            } else {
                if (eventSaver === 'chain') {
                    history.textContent = history.textContent.slice(0, -1) + '+';
                } else {
                    setVar(event.target.textContent);
                    history.textContent = `${a.toString()} +`;
                }
            }
        } else if (event.target.matches('.subtract')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand') || eventSaver === '**' && operator !== '**') {
                chainCalculate();
                history.textContent += ' -';
            } else {
                if (eventSaver === 'chain') {
                    history.textContent = history.textContent.slice(0, -1) + '-';
                } else {
                    setVar(event.target.textContent);
                    history.textContent = `${a.toString()} -`;
                }
            }
        } else if (event.target.matches('.divide')) {
            if (currentText.textContent !== '' && a !== '' && currentText.firstChild.matches('.operand') || eventSaver === '**' && operator !== '**') {
                chainCalculate();
                history.textContent += ' /';
            } else {
                if (eventSaver === 'chain') {
                    history.textContent = history.textContent.slice(0, -1) + '/';
                } else {
                    setVar(event.target.textContent);
                    history.textContent = `${a.toString()} /`;
                }
            }
        } else if (event.target.matches('.squared') && currentText.textContent !== '' && eventSaver !== 'chain') { 
            if (eventSaver === 'operator' || eventSaver === '**' && operator !== '**') {
                let operatorSaver = operator;
                operator = '**';
                if (eventSaver === 'operator') {
                    history.textContent += ` ${parseEntry()}**2`;
                } else {
                    history.textContent += '**2';
                    eventSaver = 'operator';
                }
                evaluate(operatorSaver);
                operator = operatorSaver;
            } else {
                operator = '**';
                history.textContent = `${parseEntry()}**2`;
                evaluate();
            }
            eventSaver = '**';
        } else if (event.target.matches('.equals') && a !== '' && currentText.textContent !== '' && eventSaver !== 'chain') {
            evaluate();
            eventSaver = '=';
        }
    }
})