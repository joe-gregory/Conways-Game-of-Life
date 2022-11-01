// this is an object constructor function. The game is an object with methods that render the table
function makeGame (rows = 5, columns = 10) {
	//GLOBAL VARIABLES
	this.rows = rows;
	this.columns = columns; 
	
	this.classAlive = 'alive';
	this.classDead = 'dead';
	this.tables = [];
	
	backupThis = this;
	
	this.pause = false;
	this.generationCounter = 1;
	this.playTime = 200;

	//SETTING UP CONTROL BAR DIV AND ELEMENTS
	//TWO CHILD DIVS: buttonsBin and countersBin
	this.controlBar = document.createElement('div'); //Creating control bar element
	this.controlBar.id = 'controlBar'; //Assigning control bar class Name
	//***ButtonsBin Div***
	//Creating botton's elements
	this.buttonsBin = document.createElement('div');
	this.buttonsBin.id = 'buttonsBin';
	this.clearButton = document.createElement('button');
	this.clearButton.id = 'clearButton';
	this.pauseButton = document.createElement('button');
	this.pauseButton.id = 'pauseButton';
	this.nextButton = document.createElement('button');
	this.nextButton.id = 'nextButton';
	this.playButton = document.createElement('button');
	this.playButton.id = 'playButton';
	//Assigning button's inner text
	this.clearButton.append('clear');
	this.pauseButton.append('pause');
	this.nextButton.append('next');
	this.playButton.append('play');
	//Link each button with its action
	this.clearButton.addEventListener('pointerdown', () => this.clearGame());
	this.pauseButton.addEventListener('pointerdown', () => this.pause = true)
	this.nextButton.addEventListener('pointerdown', () => this.nextGeneration());
	this.playButton.addEventListener('pointerdown', () => this.play());
	//Adding each button to the ButtonsBin Div
	this.buttonsBin.append(this.clearButton);
	this.buttonsBin.append(this.pauseButton);
	this.buttonsBin.append(this.nextButton);
	this.buttonsBin.append(this.playButton);
	//Adding buttonsBin Div to controlBar's div
	this.controlBar.append(this.buttonsBin); 	

	//***CountersBin***
	this.countersBin = document.createElement('div'); //Counters Bin
	this.countersBin.id = 'countersBin'
	this.countersLabel = document.createElement('p');
	this.countersLabel.id = 'countersLabel';
	this.counter = document.createElement('p');
	this.counter.id = 'counter';
	this.counter.append(this.generationCounter);
	this.countersBin.append(this.countersLabel); //Adding countersLabel and counter to CountersBin
	this.countersBin.append(this.counter);
	//Adding CountersBin to ControlBars div
	this.controlBar.append(this.countersBin);
	//Adding controlBar to lifes-bin
	
	this.createTable = function (rows = this.rows, columns = this.columns) {
		tbl = document.createElement('table');
		for (let i = 0; i < rows; i++) {
			let row = document.createElement("tr");
			for (let j = 0; j < columns; j++) {
				let cell = document.createElement("td");
				cell.className = this.classDead;
				cell.addEventListener('click', backupThis.toggleState);	
				row.append(cell);	
			}	
			tbl.append(row);	
		}
		tbl.id ="newTable";
		return tbl;
	} 
	
	this.addCellToggleEventListener = function (tbl) {
		for (let r of tbl.rows) {
			for (let c of r.cells) {
				c.addEventListener('click', backupThis.toggleState); 
			}
		}
	}

	this.removeCellToggleEventListener = function (tbl) {
		for (let r of tbl.rows){
			for (let c of r.cells){
				c.removeEventListener('click', backupThis.toggleState);
			}
		}
	}
	
	this.createAndRender = function () {
		document.documentElement.style.setProperty("--columns", this.columns);
		document.documentElement.style.setProperty("--rows", this.rows);
		this.tables.push(this.createTable());
		//here puedo hacer lifes-bin un objecto en este programa y append it a body	
		document.getElementById('lifes-bin').append(this.controlBar);
		document.getElementById('lifes-bin').append(this.tables[0]);
	}

	this.clearGame = function () {
		for (let r of this.tables[0].rows) {
			for (let c of r.cells) {
				c.className = this.classDead;
			}
		}
		this.generationCounter = 1;
		this.counter.innerHTML = this.generationCounter;
	}

	this.play = function () {
		this.pause = false;
		setTimeout(function run(){
			if (!backupThis.pause){ 
				backupThis.nextGeneration();
				setTimeout(run, backupThis.playTime)}
		}, backupThis.playTime);
	}
	
	this.toggleState = function(eventObject) {
		(eventObject.target.className == backupThis.classDead) ? eventObject.target.className = backupThis.classAlive : eventObject.target.className = backupThis.classDead; 
	}

	this.nextGeneration = function () {
		this.tables.push(this.nextGenerationTable(this.tables[0]));	
		this.tables[0].remove();
		this.tables.shift();
		this.addCellToggleEventListener(this.tables[0]);
		this.generationCounter++;
		this.counter.innerHTML = this.generationCounter;
		document.getElementById('lifes-bin').append(this.tables[this.tables.length-1]);
	}

	this.nextGenerationTable = function (tbl) {
		//Returns a 'next generation' table calculated from a table tbl
		tbl.id = 'oldTable';
		newTbl = document.createElement('table');
		newTbl.id = 'newTable';
		for (let row = 0; row < tbl.rows.length; row++){
			r = document.createElement('tr');//create row to be appended
			for(let cell = 0; cell < tbl.rows[row].cells.length ; cell++) {
				//figure out how many alive neighbors
				currentState = tbl.rows[row].cells[cell].className;
				aliveNeighbors = 0;
				for (let rr = row - 1; rr < row + 2; rr++){
					if (rr < 0 || rr >= tbl.rows.length){
					} else {
						for (let cc = cell - 1; cc < cell + 2; cc++){
							if (cc < 0 || cc >= tbl.rows[row].cells.length || (cc == cell && rr == row)){
							} else {
								if (tbl.rows[rr].cells[cc].className == this.classAlive) {
									aliveNeighbors++;
								}
							}
						}
					}
				}
				c = document.createElement('td');
				//Each alive cell with one or no neighbors dies, as if by solitude
				//Each alive cell with four or more neighbors dies, as if by overpopulation
				//Each alive cell with two or three neighbors survivdes
				//Each dead cell with three neighbors becomes populated
				if (currentState == this.classAlive && aliveNeighbors > 1 && aliveNeighbors < 4){
					c.className = this.classAlive;
				} else if (currentState == this.classDead && aliveNeighbors == 3){
					c.className = this.classAlive;
				} else {
					c.className = this.classDead;
				}
				r.append(c);
			}
			newTbl.append(r);
		}
		return newTbl;
	}
}


window.addEventListener('DOMContentLoaded', (eventObject) => {startGame();});
function startGame(r = 10, c = 10) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.createAndRender();	
}
 
