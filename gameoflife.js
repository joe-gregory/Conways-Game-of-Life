// this is an object constructor function. The game is an object with methods that render the table
function makeGame (rows = 5, columns = 10) {

	this.rows = rows;
	this.columns = columns; 
	
	this.createTable = function () {
		
		this.table = document.createElement('table');	
		this.tableBody = document.createElement('tbody');

		for (let i = 0; i < this.rows; i++) {
			
			let row = document.createElement("tr");
		
			for (let j = 0; j < this.columns; j++) {
			
				let cell = document.createElement("td");
				cell.className = "dead"; 	
				row.appendChild(cell);	
	
			}	
		
			this.tableBody.appendChild(row);	
		}
		this.table.appendChild(this.tableBody);
		
	} 
	
	this.renderTable = function () {
		this.createTable();	
		document.getElementById('lifes-bin').appendChild(this.table);
	}

	this.whatState = function (r, c) {
		return this.table.rows[r].cells[c].className;
	}
	this.setState = function(r, c, state) {
		this.table.rows[r].cells[c].className = state;	
	}
}


window.addEventListener('DOMContentLoaded', (event) => {startGame();});
function startGame(r = 5, c = 10) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.renderTable();	
}
 
