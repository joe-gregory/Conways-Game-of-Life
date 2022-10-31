// this is an object constructor function. The game is an object with methods that render the table
function makeGame (rows = 5, columns = 10) {

	this.rows = rows;
	this.columns = columns; 
	this.classAlive = 'alive';
	this.classDead = 'dead';
	this.tables = [];
	this.controlBar = document.createElement('div');
	this.clearButton = document.createElement('button');
	this.pauseButton = document.createElement('button');
	this.oneGenerationButton = document.createElement('button');
	backupThis = this;

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
		this.oneGenerationButton.append('next');
		this.controlBar.append(this.clearButton);
		this.controlBar.append(this.pauseButton);
		this.controlBar.append(this.oneGenerationButton);
		this.clearButton.addEventListener('pointerdown', () => {
		this.clearGame();
		});
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
	}

	this.nextGeneration = function () {

		
	}
}


window.addEventListener('DOMContentLoaded', (event) => {startGame();});
function startGame(r = 5, c = 10) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.createAndRender();	
}
 
