var c = document.getElementById("canvas");
var cpBut = document.getElementById("cpBut");
var ctx = c.getContext("2d");
var avInput = document.getElementById("avNum");
var hcpBut = document.getElementById("hcpBut");
var hLinesBut = document.getElementById("hLinesBut");
var hCurBut = document.getElementById("hCurvesBut");

// bools de botoes
var clickedCp = false, hiddenCp = false, hiddenLines = false, hiddenCurves = false;

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

    if(!hiddenCp) createCp([posX, posY]);
    controlList[curveCount][pointCount] = [posX,posY];
    // se tiver mais de um ponto, eu faco uma linha
    if(pointCount > 0 && !hiddenLines) createLine(prevPoint, [posX,posY], "#f08b9c", 1, false);
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
        if(q > 0 && !hiddenCurves) createLine(pointList[curveCount][q-1], pointList[curveCount][q], "#afcbff", 3, false);
    }
}


function drawExt(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!hiddenCp){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 0; j < controlList[i].length; j++){
                createCp(controlList[i][j]);
            }
        }
    }
    if(!hiddenLines){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 1; j < controlList[i].length; j++){
                createLine(controlList[i][j-1], controlList[i][j], "#f08b9c", 1, false);
            }
        }
    }
    if(!hiddenCurves){
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
        cpBut.innerHTML = "Criar curva";
        controlList[curveCount] = [];
        c.addEventListener("click", addControlPoint);
    } else {
        clickedCp = false;
        curveCount++;
        cpBut.innerHTML = "Adicionar pontos de controle";
        c.removeEventListener("click", addControlPoint);
    }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // tirando curvas da memoria
    curveCount = 0;
    controlList = [];
    pointList = [];
    // caso a pessoa clicou nisso enquanto criava uma curva
    if(clickedCp){
        clickedCp = false;
        cpBut.innerHTML = "Adicionar pontos de controle";
        c.removeEventListener("click", addControlPoint);
    }
    if(hiddenCp){
        hiddenCp = false;
        hcpBut.innerHTML = "Esconder pontos de Controle";
    }
    if(hiddenLines){
        hiddenLines = false;
        hLinesBut.innerHTML = "Mostrar linhas de controle";
    }
    if(hiddenCurves){
        hiddenCurves = false;
        hCurBut.innerHTML = "Esconder curvas";
    }

}

function hcpButClick(){
    if(!hiddenCp){
        hiddenCp = true;
        hcpBut.innerHTML = "Mostrar pontos de Controle";
    } else {
        hiddenCp = false;
        hcpBut.innerHTML = "Esconder pontos de Controle";
    }
    drawExt();
}

function hlButClick(){
    if(!hiddenLines){
        hiddenLines = true;
        hLinesBut.innerHTML = "Mostrar linhas de controle";
    } else {
        hiddenLines = false;
        hLinesBut.innerHTML = "Esconder linhas de controle";
    }
    drawExt();
}

function hcurButClick(){
    if(!hiddenCurves){
        hiddenCurves = true;
        hCurBut.innerHTML = "Mostrar curvas";
    } else {
        hiddenCurves = false;
        hCurBut.innerHTML = "Esconder curvas";
    }
    drawExt();
}

function selButClick(){
    if(selectedCurve == curveCount-1){
        selectedCurve = 0;
    } else {
        selectedCurve++;
    }
    drawExt();
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