const MINEFIELD_W = 9;
const MINEFIELD_H = 9;
const MINEFIELD_MINES = 10;

const CLOSED_EXPLOSION = 11;
const CLOSED_FLAG = 10;
const CLOSED = 9;

const STATE_PLAYING = 0;
const STATE_DEAD = 1;
const STATE_WON = 2;

let mine;

function resetMine() {
    mine = {
        // number[][] - -1 = explosion, 0-9 = opened, 10 = closed, 11 = flag
        opened: [],
        // boolean[][]
        mines: [],
        generatedMines: false,
        // 0 - playing, 1 - ded, 2 - won
        state: STATE_PLAYING,
        // used to calculate when the player wins
        safeRemaining: MINEFIELD_W * MINEFIELD_H - MINEFIELD_MINES,
        // flags placed
        flags: 0,
        // time played
        time: 0
    };
    for (let x = 0; x < MINEFIELD_W; x++) {
        mine.opened[x] = [];
        mine.mines[x] = [];
        for (let y = 0; y < MINEFIELD_H; y++) {
            mine.opened[x][y] = CLOSED;
            mine.mines[x][y] = false;
        }
    }
    fox.className = "fox face-happy"
    renderMinefield();
    updateTopBar()
}

function generateMinefield(ignoreX,ignoreY) {
    for (var i = 0; i < MINEFIELD_MINES; i++) {
        while (true) {
            var x = Math.floor(Math.random() * MINEFIELD_W);
            var y = Math.floor(Math.random() * MINEFIELD_H);
            if (x == ignoreX && y == ignoreY) continue;
            if (mine.mines[x][y]) continue;
            mine.mines[x][y] = true;
            break;
        }
    }
    mine.generatedMines = true;
}

function minesSurrounding(x,y) {
    var count = 0;
    // why write good code when you can just
    // not
    if (mine.mines[x-1] && mine.mines[x-1][y-1]) count++;
    if (mine.mines[x-1] && mine.mines[x-1][y]  ) count++;
    if (mine.mines[x-1] && mine.mines[x-1][y+1]) count++;
    if (mine.mines[x]   && mine.mines[x][y-1]  ) count++;
    if (mine.mines[x]   && mine.mines[x][y+1]  ) count++;
    if (mine.mines[x+1] && mine.mines[x+1][y-1]) count++;
    if (mine.mines[x+1] && mine.mines[x+1][y]  ) count++;
    if (mine.mines[x+1] && mine.mines[x+1][y+1]) count++;
    return count;
}

function openBlock(x,y, ignoreMines) {
    if (x < 0 || x >= MINEFIELD_W || y < 0 || y >= MINEFIELD_H) return;
    if (mine.state !== STATE_PLAYING) return;
    if (!mine.generatedMines) generateMinefield(x,y);
    if (mine.opened[x][y] != CLOSED) return;
    
    if (mine.mines[x][y]) {
        if (ignoreMines) return;
        mine.opened[x][y] = CLOSED_EXPLOSION;
        mine.state = STATE_DEAD;
        drawGameOver();
        fox.className = "fox face-dead";
        setTimeout(()=>alert("KABOOM! You're dead."))
    } else {
        var surrounding = minesSurrounding(x,y);
        mine.opened[x][y] = surrounding;
        renderBlock(x,y);
        mine.safeRemaining--;
        if (surrounding == 0) {
            // somebody toucha my spaghet
            openBlock(x-1,y-1, true);
            openBlock(x-1,y, true);
            openBlock(x-1,y+1, true);
            openBlock(x,y-1, true);
            openBlock(x,y+1, true);
            openBlock(x+1,y-1, true);
            openBlock(x+1,y, true);
            openBlock(x+1,y+1, true);
        }
    }
    if (mine.safeRemaining == 0) {
        mine.state = STATE_WON;
        fox.className = "fox face-cool"
        drawGameOver();
        setTimeout(()=>alert("Congratulations! You won!"))
    }
}




var canvas = document.getElementById('minefield-canvas');
var ctx = canvas.getContext('2d');
var spritesheet = document.querySelector('#spritesheet');
spritesheet.onload = () => renderMinefield();
console.log(canvas,ctx)

var fox = document.querySelector('.fox');

function drawSprite(spriteid, x,y,w,h) {
    ctx.drawImage(spritesheet, spriteid * 16, 0, 16, 16, x, y, w, h);
}

function renderBlock(x,y) {
    var block = mine.opened[x][y];
    var xPos = x * (canvas.width / MINEFIELD_W);
    var yPos = y * (canvas.height / MINEFIELD_H);
    var width = (canvas.width / MINEFIELD_W);
    var height = (canvas.height / MINEFIELD_H);
    drawSprite(block, xPos, yPos, width, height);
}

function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < MINEFIELD_W; x++) {
        for (let y = 0; y < MINEFIELD_H; y++) {
            var id = mine.opened[x][y];
            var minePresent = mine.mines[x][y];
            if (id !== CLOSED_FLAG &&  minePresent) id = 12;
            if (id  == CLOSED_FLAG && !minePresent) id = 13;
            drawSprite(id, x * (canvas.width / MINEFIELD_W), y * (canvas.height / MINEFIELD_H), (canvas.width / MINEFIELD_W), (canvas.height / MINEFIELD_H));
        }
    }
}

function renderMinefield() {
    console.log("hi")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < MINEFIELD_W; x++) {
        for (let y = 0; y < MINEFIELD_H; y++) {
            renderBlock(x,y);
        }
    }
}

canvas.addEventListener("contextmenu", (evt) => {
    evt.preventDefault();
    return false;
})

canvas.addEventListener("mousedown", (evt) => {
    if (evt.button == 0 && fox.classList.contains("face-happy")) fox.className = "fox face-shock"
})

canvas.addEventListener('mouseup',(evt) => {
    if (mine.state !== STATE_PLAYING) return resetMine();
    if (fox.classList.contains("face-shock")) fox.className = "fox face-happy"
    var x = Math.floor(evt.offsetX / (canvas.width / MINEFIELD_W));
    var y = Math.floor(evt.offsetY / (canvas.height / MINEFIELD_H));
    if (evt.button == 0) {
        openBlock(x,y);
    } else {
        if (mine.opened[x][y] == CLOSED) {
            mine.opened[x][y] = CLOSED_FLAG;
            mine.flags++;
        } else if (mine.opened[x][y] == CLOSED_FLAG) {
            mine.opened[x][y] = CLOSED;
            mine.flags--;
        }
        updateTopBar();
        renderBlock(x,y);
    }
    evt.preventDefault()
})

fox.addEventListener("mouseup", () => resetMine())

resetMine();


function setStatDisplay(stat,value) {
    var safe = Math.min(Math.max(Math.floor(value),0),999);
    var st = ['0','0','0',...safe.toString()];
    var three = st.pop();
    var two = st.pop();
    var one = st.pop();
    document.getElementById(stat).innerHTML = `
        <div class="stat-value stat-value-${one}"></div>
        <div class="stat-value stat-value-${two}"></div>
        <div class="stat-value stat-value-${three}"></div>
    `
}

function updateTopBar() {
    setStatDisplay("mines", MINEFIELD_MINES - mine.flags);
    setStatDisplay("time", mine.time);
}

setInterval(()=>{
    if (mine.state == STATE_PLAYING && mine.generatedMines) {
        mine.time++;
        updateTopBar();
    }
},1000)
