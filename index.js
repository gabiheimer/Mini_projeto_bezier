var c = document.getElementById("canvas");
var cpBut = document.getElementById("cpBut");
var ctx = c.getContext("2d");
var clickedCp = false;
// variaveis globais que uso no addControlPoint - nao me julgue pf
var pointCount, prevPoint, curveCount = 0, qttPoints = 100;
var controlList = [], pointList = [];

function addControlPoint(e){
    // ajeitando o problema de pegar a posicao com flexbox
    var posX = e.clientX - c.getBoundingClientRect().left;
    var posY = e.clientY - c.getBoundingClientRect().top;

    ctx.beginPath();
    ctx.strokeStyle = "#f08b9c";
    ctx.lineWidth = 1;
    ctx.arc(posX, posY, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f08b9c';
    ctx.fill();
    ctx.stroke();
    ctx.arc(posX, posY, 6, 0, 2 * Math.PI, false);
    ctx.stroke();

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
    for(var q = 0; q < qttPoints; q++){
        var t = q*1/qttPoints;
        pointList[curveCount][q] = deCast(t);
        if(q > 0) drawLine(pointList[curveCount][q-1], pointList[curveCount][q], "#afcbff");
    }
}