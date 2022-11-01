// this is an object constructor function. The game is an object with methods that render the table
function makeGame (rows = 5, columns = 10) {

	this.rows = rows;
	this.columns = columns; 
	this.classAlive = 'alive';
	this.classDead = 'dead';
	this.tables = [];
	backupThis = this;
	this.pause = false;
	this.generationCounter = 1;
	
	this.playTime = 200;


	this.controlBar = document.createElement('div');
	this.controlBar.id = 'controlBar';
	this.clearButton = document.createElement('button');
	this.pauseButton = document.createElement('button');
	this.nextButton = document.createElement('button');
	this.playButton = document.createElement('button');

	
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

	this.createControlBar = function () {
		this.clearButton.append('clear');
		this.pauseButton.append('pause');
		this.nextButton.append('next');
		this.playButton.append('play');
		this.counter = document.createElement('p');
		this.counter.append(this.generationCounter);
		this.counter.id = "counter";

		this.controlBar.append(this.clearButton);
		this.controlBar.append(this.pauseButton);
		this.controlBar.append(this.nextButton);
		this.controlBar.append(this.playButton);
		this.controlBar.append(this.counter);

		this.clearButton.addEventListener('pointerdown', () => this.clearGame());
		this.pauseButton.addEventListener('pointerdown', () => this.pause = true)
		this.nextButton.addEventListener('pointerdown', () => this.nextGeneration());
		this.playButton.addEventListener('pointerdown', () => this.play());

	}
	
	this.createAndRender = function () {
		this.tables.push(this.createTable());	
		this.createControlBar();
		document.getElementById('lifes-bin').append(this.tables[0]);
		document.getElementById('lifes-bin').prepend(this.controlBar);
	}

	this.whatState = function (r, c) {
		return this.table.rows[r].cells[c].className;
	}

	this.setState = function(r, c, state) {
		this.table.rows[r].cells[c].className = state;	
	}

	this.toggleState = function(eventObject) {
		(eventObject.target.className == backupThis.classDead) ? eventObject.target.className = backupThis.classAlive : eventObject.target.className = backupThis.classDead; 
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
		newTbl = document.createElement('table');
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
			//document.getElementById('lifes-bin').append(newTbl);
		}
		return newTbl;
	}
}


window.addEventListener('DOMContentLoaded', (event) => {startGame();});
function startGame(r = 10, c = 10) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.createAndRender();	
}
 
