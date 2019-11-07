var c = document.getElementById("canvas");
var cpBut = document.getElementById("cpBut");
var ctx = c.getContext("2d");
var clickedCp = false;
// variaveis globais que uso no addControlPoint - nao me julgue pf
var pointCount, prevPoint;

function addControlPoint(e){
    // ajeitando o problema de pegar a posicao com flexbox
    var posX = e.pageX - c.getBoundingClientRect().left;
    var posY = e.pageY - c.getBoundingClientRect().top;

    pointCount++;
    ctx.beginPath();
    ctx.arc(posX, posY, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.arc(posX, posY, 6, 0, 2 * Math.PI, false);
    ctx.stroke();

    // se tiver mais de um ponto, eu faco uma linha
    if(pointCount > 1){
        ctx.moveTo(prevPoint[0], prevPoint[1]);
        ctx.lineTo(posX, posY);
        ctx.stroke();
    }
    prevPoint = [posX, posY];
}

function cpClick(){
    if(!clickedCp){
        clickedCp = true;
        pointCount = 0;
        cpBut.innerHTML = "Criar curva";

        c.addEventListener("click", addControlPoint);
    } else {
        clickedCp = false;
        cpBut.innerHTML = "Adicionar pontos de controle";
        c.removeEventListener("click", addControlPoint);
    }
}