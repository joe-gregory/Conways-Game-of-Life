# Conways-Game-of-Life
Conway's Game of Life implemented purely on front-end using 
HTML tables and vanilla JS 

This is a Game of Life that is 100% implemented using HTML tables. This can be useful for adding on existing websites that would like to showcase Conway's Game of Life.

A CSS styles sheet is provided with all the classes/ids present in the simulation so that you can add your own customized look.

Implementation
There is an object constructor function that can be used to create the object that runs the simulation. Optional parameters are:

gameOfLife = new makeGame(rows, columns, counterLabel, ms)

Rows and columns expects an integer value for the size of the table. They default to 5 and 10, respectively. counterLabel is the text that appears next to the generations counter. It defaults to 'Generation: ' ms represents the milliseconds between updating the table. It defaults to 300.

Afterwards, call createandRender() on your new object. For example:

window.addEventListener('DOMContentLoaded', (eventObject) => {startGame();}); function startGame(r = 20, c = 20) { gameOfLife = new makeGame (r, c); gameOfLife.createAndRender(); }
