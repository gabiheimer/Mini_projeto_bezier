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

// event listeners que sempre tao ligados
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

    drawCp([posX, posY]);
    // se tiver mais de um ponto, eu faco uma linha
    if(pointCount > 0) drawLine(prevPoint, [posX,posY], "#f08b9c");
    prevPoint = [posX, posY];
    controlList[curveCount][pointCount] = [posX,posY];
    pointCount++;
}

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

function drawLine(pointA, pointB, color){
    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.strokeStyle = color;
    color == "#afcbff" ? ctx.lineWidth = 3 : ctx.lineWidth = 1;
    ctx.stroke();
}

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

function drawCurve(){
    pointList[curveCount] = [];
    for(var q = 0; q <= qttPoints; q++){
        var t = q*1/qttPoints;
        pointList[curveCount][q] = deCast(t);
        if(q > 0) drawLine(pointList[curveCount][q-1], pointList[curveCount][q], "#afcbff");
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
        hideCps();
    } else {
        hiddenCp = false;
        hcpBut.innerHTML = "Esconder pontos de Controle";
        for(var i = 0; i < controlList.length; i++){
            for(var j = 0; j < controlList[i].length; j++){
                drawCp(controlList[i][j]);
            }
        }
    }
}

function hideCps(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // desenhar linhas
    if(!hiddenLines){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 1; j < controlList[i].length; j++){
                drawLine(controlList[i][j-1], controlList[i][j], "#f08b9c");
            }
        }
    }
    // desenhar curva
    if(!hiddenCurves){
        for(var i = 0; i < pointList.length; i++){
            for(var j = 1; j < pointList[i].length; j++){
                drawLine(pointList[i][j-1], pointList[i][j], "#afcbff");
            }
        }
    }
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

function hideLines(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // desenhar pontos
    if(!hiddenCp){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 0; j < controlList[i].length; j++){
                drawCp(controlList[i][j]);
            }
        }
    }
    // desenhar curva
    if(!hiddenCurves){
        for(var i = 0; i < pointList.length; i++){
            for(var j = 1; j < pointList[i].length; j++){
                drawLine(pointList[i][j-1], pointList[i][j], "#afcbff");
            }
        }
    }
}

function hlButClick(){
    if(!hiddenLines){
        hiddenLines = true;
        hLinesBut.innerHTML = "Mostrar linhas de controle";
        hideLines();
    } else {
        hiddenLines = false;
        hLinesBut.innerHTML = "Esconder linhas de controle";
        for(var i = 0; i < controlList.length; i++){
            for(var j = 1; j < controlList[i].length; j++){
                drawLine(controlList[i][j-1], controlList[i][j], "#f08b9c");
            }
        }
    }
}

function hcurButClick(){
    if(!hiddenCurves){
        hiddenCurves = true;
        hCurBut.innerHTML = "Mostrar curvas";
        hideCurves();
    } else {
        hiddenCurves = false;
        hCurBut.innerHTML = "Esconder curvas";
        for(var i = 0; i < pointList.length; i++){
            for(var j = 1; j < pointList[i].length; j++){
                drawLine(pointList[i][j-1], pointList[i][j], "#afcbff");
            }
        }
    }
}

function hideCurves(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // desenhar pontos e linhas
    if(!hiddenCp || !hiddenLines){
        for(var i = 0; i < controlList.length; i++){
            for(var j = 0; j < controlList[i].length; j++){
                if(!hiddenCp) drawCp(controlList[i][j]);
                if(j>0 && !hiddenLines){
                    drawLine(controlList[i][j-1], controlList[i][j], "#f08b9c");
                }
            }
        }
    }
}