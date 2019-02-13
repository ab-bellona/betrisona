/**Declaring default variables**/
var gameOver= false; //is game over?
var alphabets;//for making next character	
var point=0;
var words;
var counter=0;//count number of correct words
var hardness;//Defiend by Levels of Game
var stop=true;//is game Stop?
var time=0;//how much time spent?
var loopTime=0;//speed of Game
var bombPoint;//first point for showing Bomb
var blockPoint;//first point for showing Block
var nextChar="";//holds next character 

/**Getting Json File from server**/
//this function needs internet connection
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "https://api.myjson.com/bins/chh9m", true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
	if (this.readyState === 4 && this.status === 200) {
		words = JSON.parse(this.responseText);
	}
};

var colors =['#b30059','#990099','#8C2121','#007a99','#008040','#86b300','#cccc00','#9900e6','#006699','#cc0000','#003cb3','#7B7B00','#e6e600','#4d9900','#e6004c','#8f246b'];//shapes colors
var world = [
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[1,manageChar()],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
	[ [0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_'],[0,'_']],
];//world of game

var backSound = new sound("sounds/background.mp3");//background sound
var loose = new sound("sounds/loose.wav");//loose sound
var win = new sound("sounds/win.wav");//win sound
var move = new sound("sounds/move.wav");//movement sound
var bomb = new sound("sounds/bomb.wav");//bomb sound

/**Creat world each time from World variable**/
function drawWorld() {
	document.getElementById('world').innerHTML = "";
	for(var y=0; y<world.length; y++) {
		for(var x=0; x<world[y].length; x++) {
			if(world[y][x][0]=== 0){
				//Empty place in World
				document.getElementById('world').innerHTML += "<div class='empty'>" + world[y][x][1] + "</div>";
			}else if(world[y][x][0]=== 1 || world[y][x][0]=== 11){
				//Not empty place in World
				if (world[y][x][1]=== 'B'){
					document.getElementById('world').innerHTML += "<div class='bomb'>" + world[y][x][1] + "</div>";
				}else if (world[y][x][1]=== 'N'){
					document.getElementById('world').innerHTML += "<div class='block'>" + world[y][x][1] + "</div>";
				}else{
					var color= colors[world[y][x][1].charCodeAt(0)%16];
					document.getElementById('world').innerHTML += "<div class='squareShape' style='background-color:"+color+";'>" + world[y][x][1] + "</div>";					
				}
			}
		}
		document.getElementById('world').innerHTML += "<br>";
	}
}

/**Moving shape down**/
function moveDown() {
	var canMove = true;
	for(var y=world.length-1; y>=0; y--) {
		for(var x=0; x<world[y].length; x++) {
			if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
				if(y+1 === world.length || world[y+1][x][0] > 10){
					canMove = false;
					freeze();
				}
			}
		}
	}
	if (canMove) {
		for(var y=world.length-1; y>=0; y--) {
			for(var x=0; x<world[y].length; x++) {
				if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
					world[y+1][x][0] = world[y][x][0];
					world[y+1][x][1] = world[y][x][1];
					world[y][x][0] = 0;
					world[y][x][1] = '_';
				}
			}
		}
		drawWorld();
	}
}

/**Moving shape left**/
function moveLeft() {
	var canMove = true;
	for(var y=world.length-1; y>=0; y--) {
		for(var x=0; x<world[y].length; x++) {
			if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
				if(x === 0 || world[y][x-1][0] > 10){
					canMove = false;
				}
			}
		}
	}
	if (canMove) {
		for(var y=world.length-1; y>=0; y--) {
			for(var x=0; x<world[y].length; x++) {
				if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
					world[y][x-1][0] = world[y][x][0];
					world[y][x-1][1] = world[y][x][1];
					world[y][x][0] = 0;
					world[y][x][1] = '_';
				}
			}
		}
		drawWorld();
	}
}

/**Moving shape right**/
function moveRight() {
	var canMove = true;
	for(var y=world.length-1; y>=0; y--) {
		for(var x=0; x<world[y].length; x++) {
			if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
				if(x === 7 || world[y][x+1][0] > 10){
					canMove = false;
				}
			}
		}
	}
	if (canMove) {
		for(var y=world.length-1; y>=0; y--) {
			for(var x=world[y].length-1; x>=0; x--) {
				if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
					world[y][x+1][0] = world[y][x][0];
					world[y][x+1][1] = world[y][x][1];
					world[y][x][0] = 0;
					world[y][x][1] = '_';
				}
			}
		}
		drawWorld();
	}
}

/**It makes shape to stop and adds a new line to world**/
function freeze(){
	for(var y=world.length-1; y>=0; y--) {
		for(var x=0; x<world[y].length; x++) {
			if(world[y][x][0] > 0 && world[y][x][0] < 10 ){
				world[y][x][0] = world[y][x][0] + 10;
				checkLines(y);
				if(y===0){
					gameOver=true;//it Checks that Game is Over?
				}
			}
		}
	}
	world[0] = [[0,'_'],[0,'_'],[0,'_'],[0,'_'],[1,manageChar()],[0,'_'],[0,'_'],[0,'_']];

}

/**In each loop of game, it checks that player made a word or not**/
//The most important function of game
function checkLines(y){
	var ans,realAns,word;
	var arrayAns=[];
	//checking for bomb
	for(var x=0; x<world[y].length; x++){
		if(world[y][x][1]==='B'){
			var p=-1;
			for(var i=0;i<=7;i++){
				if(world[y][i][0]>0){
					p++;
				}
				world[y][i][0]=0;
				world[y][i][1]='_';
			}
			if(p>0){
				points(p,'بمب');	
			}
			var d=y-1;
			for(d; d>=0; d--) {
				for(var x=0; x<world[d].length; x++) {
					if(world[d][x][0] > 0 && world[d+1][x][0] === 0){
						world[d+1][x][0] = world[d][x][0];
						world[d+1][x][1] = world[d][x][1];
						world[d][x][0] = 0;
						world[d][x][1] = '_';
					}
				}
			}
			checkLines(y);
		}
	}
	//checking for correct words
	for(var co=7; co>=2 ;co--){
		for (var x=0; x<world[y].length; x++){
			if(x+co<9){
				ans = world[y].slice(x,x+co);
				arrayAns=[];
				for(var i=0;i<ans.length;i++){
					arrayAns.push(ans[i][1]);
				}
				if(arrayAns.indexOf("_") >=0){
					continue;//It prevents unnecessary Loops	
				}
				arrayAns.reverse();
				realAns=arrayAns.join("");
				for (var w = 0; w < words[co].length; w++) {
					word = words[co][w];
					if(realAns===word){
						var counter=x+co-1;
						for(x;x<=counter;x++){
							world[y][x][0]=0;
							world[y][x][1]='_';
						}
						var d=y-1;
						for(d; d>=0; d--) {
							for(var x=0; x<world[d].length; x++) {
								if(world[d][x][0] > 0 && world[d+1][x][0] === 0){
									world[d+1][x][0] = world[d][x][0];
									world[d+1][x][1] = world[d][x][1];
									world[d][x][0] = 0;
									world[d][x][1] = '_';
								}
							}
						}
						points(co,word);//adds Point when player made a word
						checkLines(y);//it checks lines again after removing a correct word
						break;
					}
				}
			}
		}
	}
}

/**Managing the corrent and next characters for showing in the world**/
function manageChar(){
	var element=document.getElementById('nextChar');
	if(nextChar===""){
		//start of the game
		nextChar=randomChar();
		var color= colors[nextChar.charCodeAt(0)%16];
		element.style.backgroundColor=color;
		element.innerHTML=nextChar;
		return randomChar();
	}else{
		var char=nextChar;
		nextChar =makeChar();
		if(nextChar==='B'){
			element.classList.add('bomb');
			element.innerHTML="";
		}else if(nextChar==='N'){
			element.classList.add('block');
			element.innerHTML="";
		}else{
			element.classList.remove('bomb');
			element.classList.remove('block');
			var color= colors[nextChar.charCodeAt(0)%16];
			element.style.backgroundColor=color;
			element.innerHTML=nextChar;
		}
		return char;
	}
}

/**makes random character**/
function randomChar(){
	var defaults = "آابپتثجچحخدذرزژسشصضطظعغکلمنوهی";
	text = defaults.charAt(Math.floor(Math.random() * defaults.length));
	return text;
}

/**makes charracters by algorithm**/
//according to probability, this function makes characters for showing in the world
function makeChar() {
	var probability=points(0,"")/hardness;//according to hardness of game
	if(typeof alphabets === 'undefined' || alphabets === ""){
		var index=Math.floor(Math.random() * 5)+2;
		alphabets=words[index][Math.floor(Math.random() * words[index].length)];
		if(points(0,"")===0){
			//showing Hint only for new players
			if(typeof(Storage) !== "undefined") {
				if(localStorage.getItem("score")===null){
					hint(alphabets);//help player to learn game
				}
			}else{
				hint(alphabets);//help player to learn game
			}
		}
		text = alphabets.charAt(0);
		alphabets = alphabets.slice(1);	
	}else if(points(0,"") >=bombPoint){
			text = 'B';
			bombPoint*=3;
	}else if(points(0,"") >=blockPoint){
			text = 'N';
			blockPoint*=3;
	}else{
		if(Math.random() <= probability){
			//if propability goes up, game gets harder
			text = randomChar();
		}else{
			text = alphabets.charAt(0);
			alphabets = alphabets.slice(1);
		}
	}
	return text;
}

/**Hint for Player**/
function hint(word){
	document.getElementById('hint').innerHTML= word;
	var element= document.getElementById('hint_container');
	element.classList.remove("showHint");
	void element.offsetWidth;
	element.classList.add("showHint");
}

/**Managing keyboard controllers**/
document.onkeyup = function(e) {
	if(!gameOver && !stop){
		if (e.keyCode === 37){
			moveLeft(); 
			move.play();
		} else if (e.keyCode === 39){
			moveRight();
			move.play();
		} else if (e.keyCode === 40){
			moveDown();
			move.play();
		}
	}
};

/**Managing Points and number of corret words**/
function points(p,word){
	if (p > 0){
		if(word==="بمب"){
			bomb.play();
		}else{
			win.play();
			counter++;
		}
		point+=p;
		document.getElementById('point').innerHTML= point;
		document.getElementById('counter').innerHTML= counter;
		document.getElementById('solved_word').innerHTML= word;
		document.getElementById('solved_word_count').innerHTML= "+"+p;
		var element= document.getElementById('showPoint');
		element.classList.remove("showAnimate");
		void element.offsetWidth;
		element.classList.add("showAnimate");
	}
	return point;
}

/**Game Timer**/
function timer(s){
	var min = parseInt(s/60);
	var sec = s%60;
	var timer = setInterval(function(){
		document.getElementById('Timer').innerHTML= ( min < 10 ) ? ( '0' + min + ' : ' ) : ( min  + ' : ' );
		document.getElementById('Timer').innerHTML+= ( sec < 10 ) ? ( '0' + sec ) : ( sec );
		sec++;
		if (sec === 61) {
			min++;
			sec=0;
		}
		if (gameOver){
			clearInterval(timer);
			gameIsOver();
		}
		if(stop){
			time= min*60+sec;
			clearInterval(timer);
			document.getElementById('Timer').classList.add('blink');
		}
	}, 1000);
}

/**changes UI and saves player data when game is over**/
function gameIsOver(){
	document.getElementById('board').classList.add('blink');
	document.getElementById('last_point').innerHTML=points(0,"");
	//checking player Best Score
	if(typeof(Storage) !== "undefined") {
		var best_score=localStorage.getItem("score");
		if(best_score){
			if(best_score<=points(0,"")){
				document.getElementById('best_score').innerHTML=points(0,"");
				document.getElementById('face').classList.remove('ti-face-sad');
				document.getElementById('face').classList.add('ti-face-smile');
				document.getElementById('face').style.color="rgb(48,197,88)";
				localStorage.setItem("score", points(0,""));
			}else{
				document.getElementById('best_score').innerHTML=best_score;
			}
		}else{
			document.getElementById('best_score').innerHTML=points(0,"");
			document.getElementById('face').classList.remove('ti-face-sad');
			document.getElementById('face').classList.add('ti-face-smile');
			document.getElementById('face').style.color="rgb(48,197,88)";
			localStorage.setItem("score", points(0,""));
		}
	}
	backSound.stop();
	loose.play();
	document.getElementById('gameOver').classList.add('active');
	document.getElementById('world').classList.add('gover');
}

/**choosing hardness of game**/
function preStart(val,hard,time){
	hardness=hard;
	loopTime=time;
	bombPoint=10-(hardness/25);//more Bomb for Easier levels
	blockPoint=hardness/25;//more Block for Hardel levels
	var elements = document.getElementsByClassName("season");
	for (var i = 0, len = elements.length; i < len; i++) {
		elements[i].classList.add('inactive');
	}
	val.classList.remove('inactive');
	val.classList.add('active');
	document.getElementById('Levels').style.zIndex="-100";
	document.getElementById('Tetris').style.opacity="1";
	document.getElementById('Introduce').classList.add('inactive');
	document.getElementById('info').classList.remove('active');
	if(typeof(Storage) !== "undefined") {
		if(localStorage.getItem("score")){
			document.getElementById('record').innerHTML=localStorage.getItem("score");
		}else{
			document.getElementById('record').innerHTML=0;
		}
	}
}

/**menu play & pause button function**/
function stopIt(){
	var element=document.getElementById('stop');
	if(stop){
		resumeIt();
		element.classList.remove('ti-control-play');
		element.classList.add('ti-control-pause');
	}else{
		pauseIt();
		element.classList.remove('ti-control-pause');
		element.classList.add('ti-control-play');
	}
}

function pauseIt(){
	stop=true;
	backSound.stop();
}

function resumeIt(){
	if(!gameOver && stop===true){
		stop=false;
		gameLoop();	
		backSound.playBack();
		document.getElementById('Timer').classList.remove('blink');
		timer(time);
	}
}

/**menu Music play & pause button function**/
function music(){
	var song=document.getElementById('music');
	if(song.classList.contains('ti-music')){
		song.classList.remove('ti-music');
		song.classList.add('ti-music-alt');
		backSound.silent();
	}else{
		song.classList.remove('ti-music-alt');
		song.classList.add('ti-music');
		backSound.loud();
	}
}

/**Staring game**/
function start(){
	stop=false;
	backSound.playBack();
	document.getElementById('world').style.opacity="1";
	document.getElementById('startButton').style.opacity="0";
	document.getElementById('startButton').style.zIndex="-1000";
	document.getElementById('controllers').style.opacity="1";
	document.getElementById('board').style.opacity="1";
	gameLoop();
	timer(0);
}

/**managing loop of game and it's speed**/
function gameLoop(){
	moveDown();
	drawWorld();
	if(gameOver){
		gameIsOver();
	}else if(!stop){
		setTimeout(gameLoop, loopTime);	
	}
}

/**Game Menu**/
function toggle(element) {
    var x = document.getElementById(element);
    if (x.classList.contains('active')) {
        x.classList.remove('active');
    } else {
        x.classList.add('active');
    }
}

/**Managing all sounds of game**/
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
	//play sound
    this.play = function(){
		var isPlaying = this.sound.currentTime > 0 && !this.sound.paused && !this.sound.ended;
		if(!isPlaying){
			this.sound.play();
		}
        
    };    
	//background music play
	this.playBack = function(){
		this.sound.setAttribute("loop","loop");
		this.sound.volume="0.5";
        this.sound.play();
    };
	//stop sound
    this.stop = function(){
		var isPlaying = this.sound.currentTime > 0 && !this.sound.paused && !this.sound.ended;
		if(isPlaying){
			this.sound.pause();
		}  
    };  
	//silent sound
	this.silent = function(){
        this.sound.volume="0";
    }; 
	//loud sound
	this.loud = function(){
        this.sound.volume="0.5";
    }; 
}

drawWorld();//draw first world
