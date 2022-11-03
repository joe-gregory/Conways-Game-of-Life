// this is an object constructor function. The game is an object with methods that render the table
function makeGame (rows = 5, columns = 10, counterLabel = 'Generation:', ms = 300) {
	//GLOBAL VARIABLES
	this.rows = rows;
	this.columns = columns; 
	this.counterLabel = counterLabel;
	
	this.aliveAttribute = 'alive';
	this.deadAttribute = 'dead';
	this.tables = [];
	backupThis = this;
	this.currentlyPlaying = false;
	
	this.generationCounter = 1;
	this.playTime = ms;

	//SETTING UP CONTROL BAR DIV AND ELEMENTS
	//TWO CHILD DIVS: buttonsBin and countersBin
	this.controlBar = document.createElement('div'); //Creating control bar element
	this.controlBar.id = 'controlBar'; //Assigning control bar ID
	//***ButtonsBin Div***
	//Creating botton's elements
	this.buttonsBin = document.createElement('div');
	this.buttonsBin.id = 'buttonsBin';
	this.clearButton = document.createElement('button');
	this.clearButton.classList.add('lifesButtons');
	this.clearButton.id = 'clearButton';
	this.pauseButton = document.createElement('button');
	this.pauseButton.classList.add('lifesButtons');
	this.pauseButton.id = 'pauseButton';
	this.nextButton = document.createElement('button');
	this.nextButton.classList.add('lifesButtons');
	this.nextButton.id = 'nextButton';
	this.playButton = document.createElement('button');
	this.playButton.classList.add('lifesButtons');
	this.playButton.id = 'playButton';
	//Assigning button's inner text
	this.clearButton.append('CLEAR');
	this.pauseButton.append('PAUSE');
	this.nextButton.append('NEXT');
	this.playButton.append('PLAY');
	//Link each button with its action
	this.clearButton.addEventListener('pointerdown', () => this.clearGame());
	this.pauseButton.addEventListener('pointerdown', () => this.currentlyPlaying = false)
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
	this.countersLabel.append(this.counterLabel);
	this.countersLabel.id = 'countersLabel';
	this.counter = document.createElement('p');
	this.counter.id = 'counter';
	this.counter.append(this.generationCounter);
	this.countersBin.append(this.countersLabel); //Adding countersLabel and counter to CountersBin
	this.countersBin.append(this.counter);
	//Adding CountersBin to ControlBars div
	this.controlBar.append(this.countersBin);
	//Creating div to contain tables:
	this.tablesDiv = document.createElement('div');
	this.tablesDiv.id = 'tablesDiv';

	this.createTable = function (rows = this.rows, columns = this.columns) {
		tbl = document.createElement('table');
		for (let i = 0; i < rows; i++) {
			let row = document.createElement("tr");
			for (let j = 0; j < columns; j++) {
				let cell = document.createElement("td");
				cell.setAttribute('data-cell-state', this.deadAttribute);	
				cell.classList.add('lifesCells');
				cell.addEventListener('click', backupThis.toggleState);	
				row.append(cell);	
			}	
			tbl.append(row);	
		}
		//tbl.id ="newTable";
		tbl.classList.add('lifesTable');
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
		this.tablesDiv.append(this.tables[0]);
		//here puedo hacer lifes-bin un objecto en este programa y append it a body	
		document.getElementById('lifes-bin').append(this.controlBar);
		document.getElementById('lifes-bin').append(this.tablesDiv);
	}

	this.clearGame = function () {
		for (let r of this.tables[0].rows) {
			for (let c of r.cells) {
				c.dataset.cellState = this.deadAttribute;
			}
		}
		this.currentlyPlaying = false;
		this.generationCounter = 1;
		this.counter.innerHTML = this.generationCounter;
	}

	this.play = function () {
		if (this.currentlyPlaying){return} //avoids calling this function more than once
		this.currentlyPlaying = true;
		setTimeout(function run(){
			if(!backupThis.currentlyPlaying){return};
			backupThis.nextGeneration();
			setTimeout(run, backupThis.playTime)}
			, backupThis.playTime);
	}
	
	this.toggleState = function(eventObject) {
		eventObject.target.dataset.cellState == backupThis.deadAttribute ? eventObject.target.dataset.cellState = backupThis.aliveAttribute : eventObject.target.dataset.cellState = backupThis.deadAttribute;
	}

	
	this.nextGeneration = function () {
		this.tables.push(this.nextGenerationTable(this.tables[0]));	
		this.tables[0].remove();
		this.tables.shift();
		this.addCellToggleEventListener(this.tables[0]);
		this.generationCounter++;
		this.counter.innerHTML = this.generationCounter;
		document.getElementById('tablesDiv').append(this.tables[this.tables.length-1]);
		
	}

	this.nextGenerationTable = function (tbl) {
		//Returns a 'next generation' table calculated from a table tbl
		tbl.id = 'oldTable';
		newTbl = document.createElement('table');
		newTbl.id = 'newTable';
		newTbl.classList.add('lifesTable');
		for (let row = 0; row < tbl.rows.length; row++){
			r = document.createElement('tr');//create row to be appended
			for(let cell = 0; cell < tbl.rows[row].cells.length ; cell++) {
				//figure out how many alive neighbors
				currentState = tbl.rows[row].cells[cell].dataset.cellState;
				aliveNeighbors = 0;
				for (let rr = row - 1; rr < row + 2; rr++){
					if (rr < 0 || rr >= tbl.rows.length){
					} else {
						for (let cc = cell - 1; cc < cell + 2; cc++){
							if (cc < 0 || cc >= tbl.rows[row].cells.length || (cc == cell && rr == row)){
							} else {
								if (tbl.rows[rr].cells[cc].dataset.cellState == this.aliveAttribute) {
									aliveNeighbors++;
								}
							}
						}
					}
				} //End figuring out how many alive neighbors
				c = document.createElement('td');
				c.classList.add('lifesCells');
				//Each alive cell with one or no neighbors dies, as if by solitude
				//Each alive cell with four or more neighbors dies, as if by overpopulation
				//Each alive cell with two or three neighbors survivdes
				//Each dead cell with three neighbors becomes populated
				if (currentState == this.aliveAttribute && aliveNeighbors > 1 && aliveNeighbors < 4){
					c.setAttribute('data-cell-state', this.aliveAttribute);
				} else if (currentState == this.deadAttribute && aliveNeighbors == 3){
					c.setAttribute('data-cell-state',this.aliveAttribute);
				} else {
					c.setAttribute('data-cell-state',this.deadAttribute);
				}
				r.append(c);
			}
			newTbl.append(r);
		}
		return newTbl;
	}
}


window.addEventListener('DOMContentLoaded', (eventObject) => {startGame();});
function startGame(r = 20, c = 20) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.createAndRender();	
}
 
