var c = document.getElementById("canvas");
var cpBut = document.getElementById("cpBut");
var ctx = c.getContext("2d");
var avInput = document.getElementById("avNum");
var delBut = document.getElementById("delBut");
var selBut = document.getElementById("selectBut");
var showPoints = document.getElementById("showPoints");
var showLines = document.getElementById("showLines");
var showCurves = document.getElementById("showCurves");

// bools de botoes
var clickedCp = false;

// variaveis globais que uso no addControlPoint - nao me julgue pf
var pointCount, prevPoint, curveCount = 0, qttPoints = 100;
var controlList = [], pointList = [];
var selectedCurve = -1;

// ================ EVENT LISTENERS ======================
avInput.addEventListener("keypress", (e) => {
    var key = e.which || e.keyCode;
    if(key == 13 && avInput.value != ""){
        qttPoints = avInput.value;
        avInput.blur();
    }
});

function cleanInput(){
    avInput.placeholder = avInput.value;
    avInput.value = "";
}

function addControlPoint(e){
    // ajeitando o problema de pegar a posicao com flexbox
    var posX = e.clientX - c.getBoundingClientRect().left;
    var posY = e.clientY - c.getBoundingClientRect().top;

    if(showPoints.checked) createCp([posX, posY]);
    controlList[curveCount][pointCount] = [posX,posY];
    // se tiver mais de um ponto, eu faco uma linha
    if(pointCount > 0 && showLines.checked) createLine(prevPoint, [posX,posY], "#f08b9c", 1, false);
    if(pointCount > 0) createCurve();
    prevPoint = [posX, posY];
    pointCount++;
}

// ================ FUNCOES DE DESENHO ======================

function createCp(point){
    ctx.beginPath();
    ctx.strokeStyle = "#f08b9c";
    ctx.lineWidth = 1;
    ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f08b9c';
    ctx.fill();
    ctx.stroke();
    ctx.arc(point[0], point[1], 6, 0, 2 * Math.PI, false);
    ctx.stroke();
}

function createLine(pointA, pointB, color, size, selCurve){
    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    if(selCurve) ctx.strokeStyle = "#ffab7b";
    else ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
}

function createCurve(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawExt();
    pointList[curveCount] = [];
    for(var q = 0; q <= qttPoints; q++){
        var t = q/qttPoints;
        pointList[curveCount][q] = deCast(t);
        if(q > 0 && showCurves.checked) createLine(pointList[curveCount][q-1], pointList[curveCount][q], "#afcbff", 3, false);
    }
}


function drawExt(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(showPoints.checked){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 0; j < controlList[i].length; j++){
                createCp(controlList[i][j]);
            }
        }
    }
    if(showLines.checked){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 1; j < controlList[i].length; j++){
                createLine(controlList[i][j-1], controlList[i][j], "#f08b9c", 1, false);
            }
        }
    }
    if(showCurves.checked){
        for(var i = 0; i < pointList.length; i++){
            if(i != curveCount){
                for(var j = 1; j < pointList[i].length; j++){
                    if(i == selectedCurve) createLine(pointList[i][j-1], pointList[i][j], "#afcbff", 3, true);
                    else createLine(pointList[i][j-1], pointList[i][j], "#afcbff", 3, false);
                }
            }
        }
    }
}

// ================ FUNCOES DE CLIQUE ======================

function cpClick(){
    if(!clickedCp){
        clickedCp = true;
        pointCount = 0;
        cpBut.innerHTML = "Pronto!";
        controlList[curveCount] = [];
        c.addEventListener("click", addControlPoint);
    } else {
        clickedCp = false;
        curveCount++;
        cpBut.innerHTML = "criar curva";
        c.removeEventListener("click", addControlPoint);
        selBut.style.visibility = 'visible';
    }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // tirando curvas da memoria
    controlList = [];
    pointList = [];
    // caso a pessoa clicou nisso enquanto criava uma curva
    if(clickedCp){
        cpClick();
    }
    curveCount = 0;
}

function selButClick(){
    if(selectedCurve == curveCount-1){
        selectedCurve = 0;
    } else {
        selectedCurve++;
    }
    drawExt();
    delBut.style.visibility = 'visible';
}

function delButClick(){
    controlList.splice(selectedCurve,1);
    pointList.splice(selectedCurve,1);
    selectedCurve = -1;
    delBut.style.visibility = 'hidden';
    drawExt();
    curveCount--;
    if(curveCount == 0) selBut.style.visibility = 'hidden';
}

// ================ ALGORITMO DA CURVA ======================

function deCast(u){
    var n = controlList[curveCount].length;
    var Q = [];

    for(var a = 0; a < n; a++){
        Q[a] = controlList[curveCount][a].slice();
    }

    for(var k = 1; k < n; k++){
        for(var i = 0; i < n-k; i++){
            Q[i][0] = (1-u)*Q[i][0] + u*Q[i+1][0];
            Q[i][1] = (1-u)*Q[i][1] + u*Q[i+1][1];
        }
    }

    return Q[0];
}