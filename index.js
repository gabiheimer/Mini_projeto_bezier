var c = document.getElementById("canvas");
var cpBut = document.getElementById("cpBut");
var ctx = c.getContext("2d");
var clickedCp = false;
// variaveis globais que uso no addControlPoint - nao me julgue pf
var pointCount, prevPoint, curveCount = 0;
var controlList = [];

function addControlPoint(e){
    // ajeitando o problema de pegar a posicao com flexbox
    var posX = e.pageX - c.getBoundingClientRect().left;
    var posY = e.pageY - c.getBoundingClientRect().top;

    ctx.beginPath();
    ctx.arc(posX, posY, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.arc(posX, posY, 6, 0, 2 * Math.PI, false);
    ctx.stroke();

    // se tiver mais de um ponto, eu faco uma linha
    if(pointCount > 0) drawLine(prevPoint, [posX,posY]);
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
        curveCount++;
        cpBut.innerHTML = "Adicionar pontos de controle";
        c.removeEventListener("click", addControlPoint);

        for(var i = 0; i < curveCount; i++){
            console.log(controlList[i]);
        }
    }
}

function drawLine(pointA, pointB){
    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.stroke();
}