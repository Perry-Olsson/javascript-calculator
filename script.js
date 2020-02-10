let operands = []; //stores operation
let eventSaver; //Store last event when needed
let previousAnswer;
const currentText = document.getElementById("current-text");
const history = document.getElementById('history');
const textBox = document.getElementById('text-box-wrapper')
const viewPort = document.querySelector('html');
currentText.textContent = ''

const spruceUp = () => {
    const operandMakeOver = operands.map((item, index) => {
        if (item.length !== undefined) {
            if (item.indexOf('r') !== -1) {
                if (index === 0) {
                    return `<img src='images/square-root-mathematical-symbol.png' style='left: 0px'width='50px' height='50px'><span style='right:15px; margin-right: 0'>${(item.slice(item.indexOf('r') + 1))}</span>`;
                }
                return `<img src='images/square-root-mathematical-symbol.png' width='50px' height='50px'><span>${(item.slice(item.indexOf('r') + 1))}</span>`;
            } else { return item; }
        } else { return item; }
    })
    return operandMakeOver;
}

const evaluate = () => {
    let ans;
    let operandArr = operands.map((item) => {
        if (item.length !== undefined) {
            if (item.indexOf('*') !== -1) {
                return parseFloat(item.slice(0, item.indexOf('*')), 10) ** 2;
            } else if (item.indexOf('r') !== -1) {
                return Math.sqrt(parseFloat(item.slice(item.indexOf('r') + 1)))
            } else { return item; }
        } else { return item; }
    });
    for (let i = 0; i < operandArr.length; i++) {
        if (operandArr[i] === 'x') {
            ans = operandArr[i - 1] * operandArr[i + 1];
            operandArr.splice(i - 1, 3, ans);
            i--;
        } else if (operandArr[i] === '/') {
            ans = operandArr[i - 1] / operandArr[i + 1];
            operandArr.splice(i - 1, 3, ans);
            i--;
        }
    }
    let i = 0
    while (operandArr.length > 1) {
        if (i === 100) {
            console.log('error');
            break;
        }
        switch (operandArr[1]) {
            case '+':
                ans = operandArr[0] + operandArr[2];
                operandArr = operandArr.slice(3);
                operandArr.unshift(ans);
                break;
            case '-':
                ans = operandArr[0] - operandArr[2];
                operandArr = operandArr.slice(3);
                operandArr.unshift(ans);
                break;
        }
    i++
    }
    return operandArr[0];
}

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
        /*if (currentText.firstChild.matches('.answer') && eventSaver === 'chain') {
            operands[operands.length - 1] = op
        } else {*/
        if (eventSaver === '=') { operands = [] }
        operands.push(parseEntry(), op);
        eventSaver = 'operator';
        currentText.textContent = '';
        history.innerHTML = spruceUp(operands)
            .join(' ');
        //}
    } else {
        changeOperator(op);
    }
}

const numCompressor = (ans) => {
    let textBoxHeight = textBox.offsetHeight;
    let textBoxWidth = textBox.offsetWidth;
    const compress = (a, b) => {
        if (a / b < 1) {
            return parseFloat(a.toFixed(2));
        } else { return a.toExponential(2); }
    }
    history.innerHTML = spruceUp(operands).join(' ');
    if (event.target.matches('.equals')) {
        history.innerHTML += ` = ${ans}`;
    }
    if (textBox.offsetHeight > textBoxHeight || textBox.offsetWidth > textBoxWidth) {
        if (operands.length > 3) {
            if (event.target.matches('.equals')) {
                history.innerHTML = spruceUp(operands).join(' ') + ' =';
            } else {
                let operandSaver = operands.slice(-2);
                operands = operands.slice(0, -2);
                operands = [evaluate()];
                operands.push(operandSaver[0], operandSaver[1]);
                history.innerHTML = spruceUp(operands).join(' ');
            }
        } else { history.innerHTML = spruceUp(operands).join(' ') + ' ='; }
    }
    if (textBox.offsetHeight > textBoxHeight || textBox.offsetWidth > textBoxWidth) {
        if (operands.length === 1) {
            operands[0] = compress(operands[0], 1000000000);
        } else {
            if (operands[0].toString().length > operands[2].toString().length) {
                operands[0] = compress(operands[0], 100000);
                history.innerHTML = spruceUp(operands).join(' ') + ' =';
                if (textBox.offsetHeight === textBoxHeight || textBox.offsetWidth === textBoxWidth) {
                    return
                }
                operands[2] = compress(operands[2], 100000);
            } else {
                operands[2] = compress(operands[2], 100000);
                history.innerHTML = spruceUp(operands).join(' ') + ' =';
                if (textBox.offsetHeight === textBoxHeight || textBox.offsetWidth === textBoxWidth) {
                    return
                }
                operands[0] = compress(operands[0], 100000);
            }
        }
        history.innerHTML = spruceUp(operands).join(' ') + ' =';
    }
}


const answerCompressor = (ans) => {
    if (ans.toString().length > 11) {
        if (ans / 100000000 < 1) {
            return ans.toFixed(11 - (ans.toString().indexOf('.') + 1));
        } else {
            return ans.toExponential(2);
        }
    }
    else { return ans.toString(); }
}
//displays answer in currentText element
const setAns = (ans, op) => {
    numCompressor(ans);
    currentText.textContent = '';
    createAnswerElement(answerCompressor(ans));
}

/*allows chain calculations e.g. 2 x 3 x 5 while displaying each answer as more 
numbers and operators are entered*/
const chainCalculate = (op) => {
    if (eventSaver !== '**' && eventSaver !== 'r') {
        operands.push(parseEntry());
    }
    eventSaver = 'chain';
    if (op === 'x' || op === '/') {
        if (operands.indexOf('+') !== -1 || operands.indexOf('-') !== -1) {
            currentText.textContent = '';
            numCompressor();
        } else { setAns(evaluate()); }
    } else { setAns(evaluate()); }
    operands.push(op);
    history.innerHTML = spruceUp(operands).join(' ');
}

const changeOperator = (op) => {
    operands[operands.length - 1] = op;
    history.innerHTML = spruceUp(operands).join(' ');
}

const mdas = (op) => {
    if (currentText.textContent !== '' && operands[0] !== undefined && currentText.firstChild.matches('.operand') || eventSaver === '**' || eventSaver === 'r') {
        chainCalculate(op);
    } else {
        if (eventSaver === 'chain') {
            changeOperator(op);
        } else {
            setVar(op);
        }
    }
}

//const exponentiate = (operand, operation, event) {

//}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num") && currentText.childElementCount < 11) {
        if (eventSaver === '=' || eventSaver === '**' || eventSaver === 'r') {
            currentText.textContent = '';
            history.textContent = '';
            eventSaver = '';
            operands = [];
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
        operands = [];
    } else if (currentText.textContent !== '' || eventSaver === 'operator') {
        if (currentText.textContent !== '' && event.target.matches('.back-space') && currentText.firstChild.matches('.operand')) {
            backSpace();
        } else if (currentText.textContent !== '' && event.target.matches('.clear') && currentText.firstChild.matches('.operand')) {
            currentText.textContent = '';
        } else if (event.target.matches('.multiply')) {
            mdas('x');
        } else if (event.target.matches('.add')) {
            mdas('+');
        } else if (event.target.matches('.subtract')) {
            mdas('-');
        } else if (event.target.matches('.divide')) {
            mdas('/');
        } else if (event.target.matches('.squared') && currentText.textContent !== '' && eventSaver !== 'chain') {
            if (eventSaver === '**' || eventSaver === 'r') {
                if (operands.length < 2) {
                    operands = [];
                }
                else {
                    operands.pop();
                }
            } else if (eventSaver === '=') { operands = []; }
            operands.push(`${parseEntry()}**2`);
            numCompressor();
            history.innerHTML = spruceUp(operands).join(' ');
            if (eventSaver === 'chain' || eventSaver === 'operator' || eventSaver === '**' && operands.length > 1 || eventSaver === 'r' && operands.length > 1) {
                let tempAns = parseEntry() ** 2;
                currentText.textContent = '';
                createAnswerElement(answerCompressor(tempAns));
            } else { setAns(evaluate()); }
            eventSaver = '**';
        } else if (event.target.matches('.square-root') && currentText.textContent !== '' && eventSaver !== 'chain') {
            if (eventSaver === 'r' || eventSaver === '**') {
                if (operands.length < 2) {
                    operands = [];
                }
                else {
                    operands.pop();
                }
            } else if (eventSaver === '=') { operands = []; }
            operands.push(`2r${parseEntry()}`);
            numCompressor();
            history.innerHTML = spruceUp(operands).join(' ');
            if (eventSaver === 'chain' || eventSaver === 'operator' || eventSaver === '**' && operands.length > 1 || eventSaver === 'r' && operands.length > 1) {
                let tempAns = Math.sqrt(parseEntry());
                currentText.textContent = '';
                createAnswerElement(answerCompressor(tempAns));
            } else { setAns(evaluate()); }
            eventSaver = 'r'
        } else if (event.target.matches('.equals') && operands !== [] && currentText.textContent !== '' && eventSaver !== 'chain') {
            let temp = parseEntry();
            if (eventSaver === '=') {
                if (operands.length < 2) {
                    if (operands[0].indexOf('*') !== -1) { operands = [`${temp}**2`]; }
                    else { operands = [`2r${temp}`]; }
                } else {
                    operands = operands.slice(-2);
                    operands.unshift(temp);
                }
            } else if (eventSaver === '**') { 
                if (operands.length < 2) {
                    operands = [`${temp}**2`]
                } 
            } else if (eventSaver === 'r') {
                if (operands.length < 2) {
                    operands = [`2r${temp}`];
                }
            } else { operands.push(temp); }
            setAns(evaluate());
            eventSaver = '=';
        }
    }
})