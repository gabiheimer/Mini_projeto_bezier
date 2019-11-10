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

// ================ FUNCOES DE PONTOS DE AVALIACAO ======================
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

// ================ FUNCOES DE DESENHO ======================

function addControlPoint(e){
    // ajeitando o problema de pegar a posicao com flexbox
    var posX = e.clientX - c.getBoundingClientRect().left;
    var posY = e.clientY - c.getBoundingClientRect().top;

    drawCp([posX, posY]);
    // se tiver mais de um ponto, eu faco uma linha
    if(pointCount > 0) drawLine(prevPoint, [posX,posY], "#f08b9c", 1);
    prevPoint = [posX, posY];
    controlList[curveCount][pointCount] = [posX,posY];
    pointCount++;
}

function drawCp(point){
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

function drawLine(pointA, pointB, color, size){
    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
}

function drawCurve(){
    pointList[curveCount] = [];
    for(var q = 0; q <= qttPoints; q++){
        var t = q*1/qttPoints;
        pointList[curveCount][q] = deCast(t);
        if(q > 0) drawLine(pointList[curveCount][q-1], pointList[curveCount][q], "#afcbff", 3);
    }
}

function drawExtCurves(){
    if(!hiddenCurves){
        for(var i = 0; i < pointList.length; i++){
            for(var j = 1; j < pointList[i].length; j++){
                drawLine(pointList[i][j-1], pointList[i][j], "#afcbff", 3);
            }
        }
    }
}

function drawExtLines(){
    if(!hiddenLines){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 1; j < controlList[i].length; j++){
                drawLine(controlList[i][j-1], controlList[i][j], "#f08b9c", 1);
            }
        }
    }
}

function drawExtPoints(){
    if(!hiddenCp){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 0; j < controlList[i].length; j++){
                drawCp(controlList[i][j]);
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
        drawCurve();
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

}

function hcpButClick(){
    if(!hiddenCp){
        hiddenCp = true;
        hcpBut.innerHTML = "Mostrar pontos de Controle";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawExtLines();
        drawExtCurves();
    } else {
        hiddenCp = false;
        hcpBut.innerHTML = "Esconder pontos de Controle";
        drawExtPoints();
    }
}

function hlButClick(){
    if(!hiddenLines){
        hiddenLines = true;
        hLinesBut.innerHTML = "Mostrar linhas de controle";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawExtPoints();
        drawExtCurves();
    } else {
        hiddenLines = false;
        hLinesBut.innerHTML = "Esconder linhas de controle";
        drawExtLines();
    }
}

function hcurButClick(){
    if(!hiddenCurves){
        hiddenCurves = true;
        hCurBut.innerHTML = "Mostrar curvas";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawExtLines();
        drawExtPoints();
    } else {
        hiddenCurves = false;
        hCurBut.innerHTML = "Esconder curvas";
        drawExtCurves();
    }
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

function selButClick(){
    if(selectedCurve == curveCount-1){
        selectedCurve = 0;
    } else {
        selectedCurve++;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawExtPoints();
    drawExtLines();
    // desenhar curvas
    if(!hiddenCurves){
        for(var i = 0; i < pointList.length; i++){
            for(var j = 1; j < pointList[i].length; j++){
                if(i == selectedCurve) drawLine(pointList[i][j-1], pointList[i][j], "#ffab7b", 3);
                else drawLine(pointList[i][j-1], pointList[i][j], "#afcbff", 3);
            }
        }
    }
}