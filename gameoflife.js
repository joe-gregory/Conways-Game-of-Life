//function that uses as input how much by how much the table size should be and creates it

function createTable (rows = 5, columns = 10) {

	let table = document.createElement("table");
	let tableBody = document.createElement('tbody');
	
	for (let i = 0; i < rows; i++) {
		let row = document.createElement("tr");

		for (let j = 0; j < columns; j++) {
			
			let cell = document.createElement("td");
			let cellText = document.createTextNode(`[${i}],[${j}]`);
			
			cell.appendChild(cellText);
			row.appendChild(cell);	
		}
		
		tableBody.appendChild(row);
		
	}
	table.appendChild(tableBody);
	document.getElementById('lifes-bin').appendChild(table);
	table.setAttribute("border","2");
}

window.addEventListener('DOMContentLoaded', (event) => {createTable();});
