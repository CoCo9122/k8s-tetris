class Tetro{
    constructor(num){
        this.tetros = [
            [-1, 0, 0, 0, 1, 0, 0, -1, '#e4007f', 0, 0, 0], //Tミノ
            [-1, 0, 0, 0, 1, 0, 1, -1, '#ff8c00', 0, 0, 0], //Lミノ
            [-1, 0, 0, 0, 1, 0, -1, -1, '#00008b', 0, 0, 0], //Jミノ
            [-1, 0, 0, 0, 0, -1, 1, -1, '#008000', 0, 0, 0], //Sミノ
            [0, -1, 0, 0, -1, -1, 1, 0, '#ff0000', 0, 0, 0], //Zミノ
            [-1, 0, 0, 0, 1, 0, 2, 0, '#00bfff', 0.5, 0.5, 0], //Iミノ
            [0, 0, 1, 0, 0, -1, 1, -1, '#ffd700', 0.5, -0.5, 0]  //Oミノ
        ]
        this.num = num;
        this.tetro = this.tetros[num].slice();
        this.tetro.push(0);
        if (num%7==5){
            this.judgeSRS=true;
        }else{
            this.judgeSRS=false;
        }
    }

    display(cv, x, y){
        for (let i=0; i<4; i++){
            cv.fillStyle = this.tetro[8];
            cv.fillRect((this.tetro[i*2]+x)*25, (this.tetro[i*2+1]+y)*25, 25, 25);
            cv.lineWidth = edgeBlockWidth;         // 線の太さ
            cv.strokeStyle = "#ffffff";  // 線の色
            cv.strokeRect((this.tetro[i*2]+x)*25, (this.tetro[i*2+1]+y)*25, 25, 25);
        }
    }

    subDisplay(cv, x, y){
        for (let i=0; i<4; i++){
            cv.fillStyle = this.tetro[8];
            cv.fillRect(this.tetro[i*2]*25+x, this.tetro[i*2+1]*25+y, 25, 25);
            cv.lineWidth = edgeBlockWidth;         // 線の太さ
            cv.strokeStyle = "#ffffff";  // 線の色
            cv.strokeRect(this.tetro[i*2]*25+x, this.tetro[i*2+1]*25+y, 25, 25);
        }
    }

    ghost(cv, x, y){

        while(true){
            if(!judgeMove(this.tetro, x, y)){
                break;
            }
            y++;
        }
        for (let i=0; i<4; i++){
            cv.fillStyle = this.tetro[8]+'23';
            cv.fillRect((this.tetro[i*2]+x)*25, (this.tetro[i*2+1]+y-1)*25, 25, 25);
            cv.lineWidth = edgeBlockWidth;         // 線の太さ
            cv.strokeStyle = this.tetro[8];  // 線の色
            cv.strokeRect((this.tetro[i*2]+x)*25, (this.tetro[i*2+1]+y-1)*25, 25, 25);
        }
        lower_y=y-1;
    }

    get(){
        return this.tetro;
    }

    resetMove(){
        this.tetro[this.tetro.length-1] = 0;
    }

    setMove(){
        this.tetro[this.tetro.length-1]++;
    }

    setInitial(){
        for (let i=0; i<8;i++){
            console.log(this.tetro[i], this.tetros[this.num][i]);
            this.tetro[i] = this.tetros[this.num][i];
        }
        this.tetro[this.tetro.length-2] = 0;
        this.tetro[this.tetro.length-1] = 0;

    }

    judgeRotation(d, points, ratateTetro){
        for (let point of points){
            if(judgeMove(this.translation(ratateTetro, point[0], point[1]), now_x, now_y)){
                this.tetro[this.tetro.length-2]+=1*(d);
                console.log('採用SRS', now_x, now_y, point);
                now_x+=point[0], now_y+=point[1];
                return true
            }
        }
        return false;
    }

    iMinoSRS(d, rotateTetro){
        let count;
        let points;
        switch(mod(this.tetro[this.tetro.length-2], 4)){
            case 0://A
                points = [
                    [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],//左回転D
                    [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]//右回転B
                ];
                count = this.judgeRotation(d, points[Math.floor((d+1)/2)], rotateTetro);
                break;
            case 1://B
                points = [
                    [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],//左回転A
                    [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]//右回転C
                ];
                count = this.judgeRotation(d, points[Math.floor((d+1)/2)], rotateTetro);
                break;
            case 2://C
                points = [
                    [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],//左回転B
                    [[0, 0], [-1, 0], [2, 0], [-1, 2],[2, -1]]//右回転D
                ];
                count = this.judgeRotation(d, points[Math.floor((d+1)/2)], rotateTetro);
                break;
            case 3://D
                points = [
                    [[0, 0], [1, 0], [-2, 0], [-2, 1], [1, -2]],//左回転C
                    [[0, 0], [-2, 0], [1, 0], [1, 2], [-2, -1]]//右回転A
                ];
                count = this.judgeRotation(d, points[Math.floor((d+1)/2)], rotateTetro);
                break;
            default:
                count = false;break;
        }
        return count;
    }

    otherMinoSRS(d, rotateTetro){
        let count;
        let points;
        switch(mod(this.tetro[this.tetro.length-2], 4)){
            case 0 :
                points = [[0, 0], [-1*(d), 0], [-1*(d), -1], [0, 2], [-1*(d), 2]];
                count = this.judgeRotation(d, points, rotateTetro);                
                break;
            case 1:
                points = [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2],];
                count = this.judgeRotation(d, points, rotateTetro);
                break;
            case 2:
                points = [[0, 0], [1*(d), 0], [1*(d), -1], [0, 2], [1*(d), 2]];
                count = this.judgeRotation(d, points, rotateTetro);
                break;
            case 3:
                points = [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]];
                count = this.judgeRotation(d, points, rotateTetro);
                break;
            default:
                count = false;break;
        }
        return count;
    }

    superRatationSystem(d){
        let count;
        let rotateTetro = this.rotation(d);
        if (this.judgeSRS){
            count = this.iMinoSRS(d, rotateTetro);
        }else{
            count = this.otherMinoSRS(d, rotateTetro);
        }
        
        if (count){
            for (let i=0; i<8;i++){
                this.tetro[i] = rotateTetro[i];
            }
        }
        //console.log(now_x, now_y, this.tetro[this.tetro.length-2]%4);
    }
    rotation(d){
        let newTetro = [];
        for (let i=0; i<4; i++){
            newTetro.push(Math.round(Math.cos(d*Math.PI/2))*(this.tetro[i*2]-this.tetro[9])
            -Math.round(Math.sin(d*Math.PI/2))*(this.tetro[i*2+1]-this.tetro[10])+this.tetro[9]);
            newTetro.push(Math.round(Math.sin(d*Math.PI/2))*(this.tetro[i*2]-this.tetro[9])
            +Math.round(Math.cos(d*Math.PI/2))*(this.tetro[i*2+1]-this.tetro[10])+this.tetro[10]);
        }
        return newTetro;
    }
    translation(t, a, b){
        let newTetro = [];
        for (let i=0; i<4; i++){
            newTetro.push(t[i*2]+a);
            newTetro.push(t[i*2+1]+b);
        }
        return newTetro;
    }
}

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}

function compareFunc(a, b) {
    return a[1] - b[1];
}

function sevenBag(){
    let bag = [0, 1, 2, 3, 4, 5, 6];
    for (let i=0; i<bag.length; i++){
        bag[i] = [bag[i], Math.random()];
    }
    bag.sort(compareFunc);
    for (let i=0; i<bag.length; i++){
        bag[i] = new Tetro(bag[i][0]);
    }
    return bag;
}

function fieldSet(){
    field = []
    for (let i=0; i<21; i++){
        let f = [];
        for (let j=0; j<10; j++){
            f.push(BASECOLOR);
        }
        field.push(f);
    }
}

function fieldDisplay(){

    can.beginPath();
    for (let i=0; i<10; i++){
        for (let j=0; j<21; j++){
            can.fillStyle = field[j][i];
            can.fillRect(i*25, j*25, canvasField.width, canvasField.height);
            can.lineWidth = edgeBlockWidth;
            can.strokeStyle = 'white';
            can.strokeRect(i*25, j*25, 25, 25);
        }
    }

    can.beginPath();
    can.moveTo(0, 25);
    can.lineTo(250, 25);
    can.lineWidth = 2;
    can.strokeStyle = 'red';
    can.stroke();

}

function judgeMove(tetro, x, y){
    for (let i=0; i<4; i++) {
        if(tetro[2*i]+x<0 || tetro[2*i]+x>9){
            return false;
        }
        if(tetro[2*i+1]+y>20) {
            return false;
        }
        let moveX = tetro[2*i]+x, moveY = tetro[2*i+1]+y;
        if (field[moveY][moveX]!=BASECOLOR){
            return false;
        }
    }
    return true;
}

function lineDelete(){
    //console.log('start',field, field.length);
    for (let i=20; i>=0; i--) {
        if(field[i].indexOf(BASECOLOR)==-1){
            field.splice(i, 1);
            //console.log('delete',i);
        }
    }
    //console.log('center', field, field.length, 21-field.length);
    deletedNumber=field.length;
    for (let i=0; i<21-deletedNumber; i++){
        let sub = [];
        //console.log('add',i);
        for(let j=0; j<10; j++){
            sub.push(BASECOLOR);
        }
        field.unshift(sub);
        //console.log(field, field.length);
    }
    //console.log('end',field, field.length);
}

function lockDown(hardDrop=false){
    if (nowTetro.get()[nowTetro.get().length-1]>30 || (performance.now()-timeMove) > 1000 || hardDrop){
        for(let i=0; i<4; i++){
            let fixX = nowTetro.get()[i*2]+now_x;
            let fixY = nowTetro.get()[i*2+1]+now_y;
            let color = nowTetro.get()[8];
            field[fixY][fixX] = color;
        }
        drop=false;
        trans=true;
        lineDelete();
        now_x=4, now_y=1;
        if (tetros.length<6){
            to = sevenBag();
            for (t of to){
                tetros.push(t);
            }
        }
        countStart = true;
        nowTetro = tetros[0];
        tetros.splice(0, 1);
        nextFieldDisplay();
        nextTetrosDisplay();
    }
}

function translation(){
    if (holdTetro==0){
        holdTetro = nowTetro;
        holdTetro.setInitial()
        nowTetro = tetros[0];
        tetros.splice(0, 1);
        if (tetros.length<6){
            to = sevenBag();
            for (t of to){
                tetros.push(t);
            }
        }
        nextFieldDisplay();
        nextTetrosDisplay();
        holdFieldDisplay();
        holdTetroDisplay();
        trans=false;
    }else{
        let centerTetro;
        centerTetro = holdTetro;
        holdTetro = nowTetro;
        holdTetro.setInitial()
        nowTetro = centerTetro;
        holdFieldDisplay();
        holdTetroDisplay();
        trans=false;
    }
}

function dropTetro(){
    let afterTetro = nowTetro.get(), afterX = now_x, afterY = now_y;
    afterY+=1;
    if(judgeMove(afterTetro, afterX, afterY)){
        if (afterY>now_y){
            nowTetro.resetMove();
        }
        timeMove = performance.now();
        now_x = afterX, now_y = afterY;
    }
}

function keyDown(e){
    //console.log(e.key);
    timeMove = performance.now();
    nowTetro.setMove();
    let afterTetro = nowTetro.get(), afterX = now_x, afterY = now_y;
    if(e.key=='s'){afterY+=1;}
    if(e.key=='a'){afterX+=-1;}
    if(e.key=='d'){afterX+=1;}
    if(e.key=='w'){afterY=lower_y;drop=true;}

    if(e.key=='ArrowRight'){nowTetro.superRatationSystem(1);}
    if(e.key=='ArrowLeft'){nowTetro.superRatationSystem(-1);}

    if((e.key=='ArrowDown' || e.key==' ') && trans){translation();afterX=4;afterY=1;}

    if(judgeMove(afterTetro, afterX, afterY)){
        if (afterY>now_y){
            nowTetro.resetMove();
        }
        now_x = afterX, now_y = afterY;
    }
}

function stop(){
    clearInterval(mainFPS);
    clearInterval(dropFPS);
    mainFPS = 0;
    dropFPS = 0;
}

function draw() {
    fieldDisplay();
    nowTetro.display(can, now_x, now_y);
    nowTetro.ghost(can, now_x, now_y);
    //console.log(now_y, lower_y);
    if(now_y==lower_y){
        lockDown(hardDrop=drop);
        if (countStart){
            timeMove = performance.now();
            countStart = false;
        }
    }
}

//HOLDの関数群
function holdFieldSet(){
    holdField = []
    for (let i=0; i<4; i++){
        let f = [];
        for (let j=0; j<4; j++){
            f.push(BASECOLOR);
        }
        holdField.push(f);
    }
}

function holdFieldDisplay(){
    canh.beginPath();
    canh.fillStyle = 'lemonchiffon';
    canh.arc(60, 60, 57, 0*Math.PI/180, 2*Math.PI, false);
    canh.fill();
    canh.lineWidth = 3;
    canh.strokeStyle = 'gray';
    canh.stroke();
}

function holdTetroDisplay(){
    if (holdTetro.num == 6){
        holdTetro.subDisplay(canh, 60-25, 60);
    }
    else if (holdTetro.num == 5){
        holdTetro.subDisplay(canh, 60-25, 60-25/2);
    }
    else{
        holdTetro.subDisplay(canh, 60-25/2, 60);
    }
}

//NEXTの関数群
function nextFieldSet(){
    nextField = []
    for (let i=0; i<20; i++){
        let f = [];
        for (let j=0; j<4; j++){
            f.push(BASECOLOR);
        }
        nextField.push(f);
    }
}

function nextFieldDisplay(){
    
    cann.beginPath();
    cann.fillStyle = 'lemonchiffon';
    cann.arc(60, 60, 57, 0*Math.PI/180, 2*Math.PI, false);
    cann.fill();
    cann.lineWidth = 3;
    cann.strokeStyle = 'gray';
    cann.stroke();

    cann.beginPath();
    cann.fillStyle = 'lemonchiffon';
    cann.fillRect(3, 130, 114, 300);
    cann.lineWidth = 3;
    cann.strokeStyle = 'gray';
    cann.strokeRect(3, 130, 114, 300);
}

function nextTetrosDisplay(){
    nextY = [60, 170, 245, 320, 395];
    for (let i=0; i<5; i++){
        if (tetros[i].num == 6){
            tetros[i].subDisplay(cann, 60-25, nextY[i]);
        }
        else if (tetros[i].num == 5){
            tetros[i].subDisplay(cann, 60-25, nextY[i]-25/2);
        }
        else{
            tetros[i].subDisplay(cann, 60-25/2, nextY[i]);
        }
        //tetros[i].display(cann, 1, i*3+2);
        //console.log(tetros[i]);
    }
}

//ボタンの仕様
function startGame(){
    str = document.getElementById('startId').innerText;
    if (str == 'START'){
        if (mainFPS != 0 && dropFPS != 0){
            stop();
        }
        now_x=4, now_y=1;
        lower_y=0;
        start=true;
        document.addEventListener('keydown', keyDown);
        tetros = sevenBag();
        nowTetro = tetros[0];
        tetros.splice(0, 1);
        nextFieldDisplay();
        nextTetrosDisplay();
        mainFPS = setInterval(draw, 10);
        holdTetro = 0;
        holdFieldDisplay();
        dropFPS = setInterval(dropTetro, 750);
        document.getElementById('startId').innerText = 'GAMERESET'
        document.getElementById('pauseDivId').style.visibility = 'visible'
    } else {
        document.getElementById('startId').innerText = 'START'
        stop();
        fieldData = [];
        nextFieldDisplay();
        holdFieldDisplay();
        fieldSet();
        fieldDisplay();
    }
    
}

function pauseBtn(){
    let pauseSentence = document.getElementById('pauseId');
    if(pause){
        stop();
        document.getElementById('startDivId').style.visibility='hidden';
        pauseSentence.innerText = 'RESTART';
        fieldData = field.slice();
        fieldSet();
        fieldDisplay();
        holdFieldDisplay();
        nextFieldDisplay();
        pause=false;
    }else{
        document.getElementById('startDivId').style.visibility='visible';
        pauseSentence.innerText = 'PAUSE';
        mainFPS = setInterval(draw, 10);
        dropFPS = setInterval(dropTetro, 750);
        field = fieldData.slice();
        fieldDisplay();
        if (holdTetro!=0){holdTetroDisplay();}
        nextTetrosDisplay();
        pause=true;
    }
}

//テンプレのフィールドの設置（練習用）

function fieldSetBtn(){
    fieldSet();
    fieldDisplay();
}

function DTfieldSetBtn(){
    DTfieldSet();
    fieldDisplay();
}

function DTfieldSet(){
    field = []
    for (let i=0; i<21; i++){
        let f = [];
        for (let j=0; j<10; j++){
            f.push(BASECOLOR);
        }
        field.push(f);
    }
    for (let i=20; i>15;i--){
        for (let j=0; j<10; j++){
            field[i][j] = 'black';
        }
    }
    field[20][2] = BASECOLOR;
    field[19][2] = BASECOLOR;
    field[18][1] = BASECOLOR, field[18][2] = BASECOLOR, field[18][3] = BASECOLOR;
    field[17][1] = BASECOLOR, field[17][2] = BASECOLOR;
    field[16][2] = BASECOLOR, field[16][5] = BASECOLOR, field[16][6] = BASECOLOR;
    field[15][3] = 'black', field[15][9] = 'black';
    field[14][2] = 'black', field[14][3] = 'black';
}

//基本設定

let BASECOLOR = 'gray';
let edgeBlockWidth = 1;

let now_x, now_y;
let lower_y;
let tetros;
let nowTetro;
let holdTetro;
let timeMove;

let mainFPS = 0;
let dropFPS = 0;

let pause = true;
let fieldData;


//メインのCANVAS
let start = false;
let countStart = true;
let drop = false;
let trans = true;
let getE = document.getElementById('canvasField');
let can = getE.getContext('2d');
let field = [];
fieldSet();
//DTfieldSet();
fieldDisplay();

//HOLDのCANVAS
let getEH = document.getElementById('holdCanvasField');
let canh = getEH.getContext('2d');
let holdField = [];
//holdFieldSet();
holdFieldDisplay();

//NEXTのCANVAS
let getEN = document.getElementById('nextCanvasField');
let cann = getEN.getContext('2d');
let nextField = [];
nextFieldSet();
nextFieldDisplay();

//setInterval(fieldDisplay, 10);