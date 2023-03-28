"use strict";

let secondPart = document.getElementsByClassName("second-part")[0];
let firstPart = document.getElementsByClassName("first-part")[0];

function insertDataAtSecondPart(val) {
    if (val == "0") {
        if (secondPart.value.length == 0) {
            secondPart.value = "";
        } else {
            secondPart.value += val;
        }
    } else {
        if (val == ".") {
            if (secondPart.value.length == 0) {
                secondPart.value += "0" + val;
            } else {
                if (secondPart.value.includes(".") != true) {
                    secondPart.value += val;
                }
            }
        } else {
            secondPart.value += val;
        }
    }
}

let digitCollection = Array.from(document.getElementsByClassName("digits"));
for (let i in digitCollection) {
    digitCollection[i].addEventListener('click', function () {
        insertDataAtSecondPart(digitCollection[i].value);
    });
}

async function checking() {
    if (secondPart.value != "") {
        return true;
    } else {
        return false;
    }
}

async function passForCalculatin(value1, operator) {
    firstPart.value += value1 + " " + operator + " ";
}

let aspqrBtnCollection = Array.from(document.getElementsByClassName("aspqr-btn"));
for (let i in aspqrBtnCollection) {
    aspqrBtnCollection[i].addEventListener('click', async function (event) {
        if (await checking()) {
            await passForCalculatin(secondPart.value, aspqrBtnCollection[i].value);
            secondPart.value = "";
        }
    })
}

function clearInputFeild() {
    firstPart.value = "";
    secondPart.value = "";
}

function deleteSingleValue() {
    let currentValue = secondPart.value;
    let newValue = currentValue.replace(currentValue[currentValue.length - 1], "");
    secondPart.value = newValue;
}

function squareOfANumber() {
    if (secondPart.value != "") {
        secondPart.value *= secondPart.value;
    }
}

function squareRoot() {
    if (secondPart.value != "") {
        secondPart.value = Math.sqrt(parseFloat(secondPart.value));
    }
}

function posToNeg() {
    if (secondPart.value < 0) {
        secondPart.value = Math.abs(secondPart.value);
    } else {
        secondPart.value = -Math.abs(secondPart.value);
    }
}

function oneByX() {
    let temp = secondPart.value;
    if (temp === secondPart.value) {
        secondPart.value = 1 / temp;
    } else {
        secondPart.value = temp;
    }
}

async function makeCalculation(arr) {
    arr = arr.split(" ");

    arr.forEach((ele, index) => {
        if (ele !== "+" && ele !== "-" && ele !== "*" && ele !== "/" && ele !== "%") {
            if (arr[index].includes(".")) {
                arr[index] = parseFloat(ele);
            } else {
                arr[index] = parseInt(ele);
            }
        }
    });

    let math = {
        "+": function (x, y) { return x + y },
        "-": function (x, y) { return x - y },
        "*": function (x, y) { return x * y },
        "/": function (x, y) { return x / y },
        "%": function (x, y) { return x % y },
        getAns: function (arr) {
            let ans = arr[0];
            arr.forEach((ele, index) => {
                if (ele === "+") { ans = this["+"](ans, arr[index + 1]); }
                else if (ele === "-") { ans = this["-"](ans, arr[index + 1]); }
                else if (ele === "*") { ans = this["*"](ans, arr[index + 1]); }
                else if (ele === "/") { ans = this["/"](ans, arr[index + 1]); }
                else if (ele === "%") { ans = this["%"](ans, arr[index + 1]); }
            })
            return ans;
        }
    };

    return math.getAns(arr);
}

//! here is working for session storage!
class getCount {
    static count = 0;
    static increaseCount() {
        return this.count++;
    }
};

async function setSessionStorage(element, count) {
    localStorage.setItem(count, element);
}

async function createHistory(history, historyCount) {
    let historyElement = `<span class = "ans">${history}</span>`;
    await setSessionStorage(historyElement, historyCount);
    document.getElementsByClassName("history__data")[0].insertAdjacentHTML('beforeend', localStorage.getItem(historyCount));
    for (let i = getCount.count - 1; i <= getCount.count - 1; i++) {
        document.getElementsByClassName("ans")[i].addEventListener('click', function() {
            let str = document.getElementsByClassName("ans")[i].innerText;
            str = str.substr(0, str.indexOf("=") - 1);
            firstPart.value = str;
            secondPart.value = "";
        })
    }
}

window.onload = () => {
    let cnt = 0;
    while (cnt < localStorage.length) {
        document.getElementsByClassName("history__data")[0].insertAdjacentHTML('beforeend', localStorage.getItem(cnt));
        cnt++;
    }
    getCount.count = localStorage.length;
    let oldSpans = Array.from(document.getElementsByClassName("ans"));
    for (let i in oldSpans) {
        oldSpans[i].addEventListener('click', function() { 
            let str = oldSpans[i].innerText;
            str = str.substr(0, str.indexOf("=") - 1);
            firstPart.value = str;
            secondPart.value = "";
        })
    }
}

async function result() {
    if (firstPart.value != "") {
        if (secondPart.value != "") {
            firstPart.value += secondPart.value;
            secondPart.value = await makeCalculation(firstPart.value);
            await createHistory(firstPart.value + " = " + secondPart.value, getCount.increaseCount());
            firstPart.value = "";
        } else {
            let deleteActOperator = firstPart.value[firstPart.value.length - 2];
            let checkDigit = firstPart.value[firstPart.value.length - 1];
            if (deleteActOperator === "+" || deleteActOperator === "-" || deleteActOperator === "/" || deleteActOperator === "%" || deleteActOperator === "*") {
                firstPart.value = firstPart.value.substr(0, firstPart.value.length - 3);
                secondPart.value = await makeCalculation(firstPart.value);
                await createHistory(firstPart.value + " = " + secondPart.value, getCount.increaseCount());
                firstPart.value = "";
            } else if (deleteActOperator !== "+" && deleteActOperator !== "-" && deleteActOperator !== "/" && deleteActOperator !== "%" && deleteActOperator !== "*") {
                secondPart.value = await makeCalculation(firstPart.value);
                await createHistory(firstPart.value + " = " + secondPart.value, getCount.increaseCount());
                firstPart.value = "";
            }
        }
    }
}

document.querySelector(".fa-trash").addEventListener('click', function () {
    localStorage.clear();
    getCount.count = 0;
    document.getElementsByClassName("history__data")[0].innerHTML = "";
})
