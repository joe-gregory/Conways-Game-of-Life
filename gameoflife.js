// this is an object constructor function. The game is an object with methods that render the table
function makeGame (rows = 5, columns = 10) {

	this.rows = rows;
	this.columns = columns; 
	this.classAlive = 'alive';
	this.classDead = 'dead';
	this.table = document.createElement('table');	
	this.tableBody = document.createElement('tbody');
	this.controlBar = document.createElement('div');
	this.clearButton = document.createElement('button');
	this.pauseButton = document.createElement('button');
	this.oneGenerationButton = document.createElement('button');

	this.createTable = function () {
		this.table.id = 'main-table';
		this.tableBody.id = 'table-body'
		for (let i = 0; i < this.rows; i++) {
			let row = document.createElement("tr");
			for (let j = 0; j < this.columns; j++) {
				let cell = document.createElement("td");
				cell.className = this.classDead;	
				row.append(cell);	
			}	
			this.tableBody.append(row);	
		}
		this.table.append(this.tableBody);
		this.tableBody.addEventListener('pointerdown', (cll) => {
			const cell = cll.target.closest('td');
			if (!cell) {return}; //quit if didn't click on cell
			this.toggleState(cell.parentElement.rowIndex, cell.cellIndex);
		});
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
		this.createTable();	
		this.createControlBar();
		document.getElementById('lifes-bin').append(this.table);
		document.getElementById('lifes-bin').prepend(this.controlBar);
	}

	this.whatState = function (r, c) {
		return this.table.rows[r].cells[c].className;
	}

	this.setState = function(r, c, state) {
		this.table.rows[r].cells[c].className = state;	
	}

	this.toggleState = function(r, c) {
		(this.whatState(r, c) == this.classDead) ? this.setState(r, c, this.classAlive) : this.setState(r, c, this.classDead); 
	}

	this.clearGame = function () {
		for (let r of this.table.rows) {
			for (let c of r.cells) {
				c.className = this.classDead;
			}
		}
	}
}


window.addEventListener('DOMContentLoaded', (event) => {startGame();});
function startGame(r = 5, c = 10) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.createAndRender();	
}
 
