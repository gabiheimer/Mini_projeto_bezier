var c = document.getElementById("canvas");
var cpBut = document.getElementById("cpBut");
var ctx = c.getContext("2d");
var clickedCp = false;

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
}

function cpClick(){
    if(!clickedCp){
        clickedCp = true;
        cpBut.innerHTML = "Criar curva";
        c.addEventListener("click", addControlPoint);
    } else {
        clickedCp = false;
        cpBut.innerHTML = "Adicionar pontos de controle";
        c.removeEventListener("click", addControlPoint);
    }
}