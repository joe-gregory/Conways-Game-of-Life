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
				cell.classList.toggle("dead");
				
				row.appendChild(cell);	
	
			}	
		
			this.tableBody.appendChild(row);	
		}
//is it already appended?: no, apparently it doesn't work like that 
		this.table.appendChild(this.tableBody);
		
	} 
	
	this.renderTable = function () {
		this.createTable();	
		document.getElementById('lifes-bin').appendChild(this.table);
	}
}


window.addEventListener('DOMContentLoaded', (event) => {startGame();});
function startGame(r = 5, c = 10) {
	gameOfLife = new makeGame (r, c);
	gameOfLife.renderTable();	
}
 
