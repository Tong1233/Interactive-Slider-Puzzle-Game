let puzzleContainer = document.getElementById('puzzle-container');
let sizeInput = document.getElementById('size');
let pieces = [];
let size = 3;
let clickEventListeners = [];//dynamic event handler needs to be stored with its own reference

sizeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const newSize = parseInt(sizeInput.value, 10);

        if (newSize >= 2 && newSize <= 8) {
            clearPuzzle();
            size = newSize;
            createPuzzle(size);
        } else {
            alert('Please enter a valid size between 2 and 8.');
        }
    }
});

sizeInput.addEventListener('input', () => {
    const newSize = parseInt(sizeInput.value, 10);

    if (newSize >= 2 && newSize <= 8) {
        clearPuzzle();
        size = newSize;
        createPuzzle(size);
    }
});

function clearPuzzle() {
    while (puzzleContainer.firstChild) {
        puzzleContainer.removeChild(puzzleContainer.firstChild);
    }
    pieces = [];
}

function createPuzzle() {
    puzzleContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${size}, 100px)`;

    pieces = Array.from({ length: size }, () => Array(size).fill(null));
    clickEventListeners = Array.from({ length: size }, () => Array(size).fill(null));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';

            if (i === size - 1 && j === size - 1) {
                // The last cell represents the empty space
                piece.textContent = '';
                piece.style.border = '2px solid blue'; // Add a blue border
                piece.style.backgroundColor = 'transparent'; // Set background to transparent
                piece.style.width  = '96px';
                piece.style.height = '96px';

            } else {
                piece.textContent = i * size + j + 1;
                piece.style.width = '100px';
                piece.style.height = '100px';
            }
            //piece.addEventListener('click', () => movePiece(i, j));
            pieces[i][j] = piece;

        }
    }
    shufflePieces(); // Call the shufflePieces function to shuffle the pieces.
    //updatePiecePositions();
    addbuttonlisteners()

}

function clickHandlerWrapper(i, j) {
    return function() {
        clickHandler(i, j);
    };
}

function clickHandler(i, j){
   movePiece(i, j);
}

function addbuttonlisteners(){
    const emptyPosition = findEmptyPosition();
    const adjacentPositions = getAdjacentPositions(emptyPosition[0], emptyPosition[1]);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if(adjacentPositions.some(([x, y]) => x === i && y === j))
            {
                clickEventListeners[i][j] = clickHandlerWrapper(i,j);
                pieces[i][j].addEventListener('click', clickEventListeners[i][j]);
            }
        }
    }

}

function shufflePieces() {
     const totalPieces = size * size - 1;

        // Create an array to represent the puzzle pieces
        const piecesArray = new Array(totalPieces);

        // Initialize the piecesArray with values from 1 to totalPieces
        for (let i = 0; i < totalPieces; i++) {
            piecesArray[i] = i + 1;
        }

        // Shuffle the piecesArray
        for (let i = piecesArray.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [piecesArray[i], piecesArray[randomIndex]] = [piecesArray[randomIndex], piecesArray[i]];
        }

        // Calculate the number of inversions in the shuffled puzzle
        let inversions = 0;
        for (let i = 0; i < piecesArray.length - 1; i++) {
            for (let j = i + 1; j < piecesArray.length; j++) {
                if (piecesArray[i] > piecesArray[j]) {
                    inversions++;
                }
            }
        }

        // If the number of inversions is odd, swap the last two pieces
        if (inversions % 2 !== 0) {
            [piecesArray[piecesArray.length - 2], piecesArray[piecesArray.length - 1]] = [
                piecesArray[piecesArray.length - 1],
                piecesArray[piecesArray.length - 2]
            ];
        }

        // Assign the shuffled values to the puzzle pieces
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i * size + j < totalPieces) {
                    pieces[i][j].textContent = piecesArray[i * size + j];
                }
            }
        }

        // Update the positions on the screen
        updatePiecePositions();
}

function movePiece(i, j) {
        const adjacentPositions = getAdjacentPositions(i, j);
        const emptyPosition = findEmptyPosition();

       // const outputElement = document.getElementById('test');
       // const myVariable = findEmptyPosition();
       // outputElement.textContent = "Empty Before " + myVariable;

       // const outputElement2 = document.getElementById('test2');
       // const myVariable2 = getAdjacentPositions(i, j);
       // outputElement2.textContent = myVariable2;


        if (adjacentPositions.some(([x, y]) => x === emptyPosition[0] && y === emptyPosition[1])) {

             // Remove the old click event listener from the moved piece,
             //pieces[i][j].removeEventListener('click', () => movePiece(i, j));
             //pieces[emptyPosition[0]][emptyPosition[1]].removeEventListener('click', () => movePiece(emptyPosition[0], emptyPosition[1]));
             swapPieces(i, j, emptyPosition[0], emptyPosition[1]);
             // Add a new click event listener to the moved piece at its new position
             //pieces[emptyPosition[0]][emptyPosition[1]].addEventListener('click', () => movePiece(emptyPosition[0], emptyPosition[1]));
             addbuttonlisteners();

             //const outputElement3 = document.getElementById('test3');
            // const myVariable3 = findEmptyPosition();
            // outputElement3.textContent = "Empty After " + myVariable3;


            updatePiecePositions();
        }

           const outputElement2 = document.getElementById('status');

           if(isPuzzleSolved())
           {
               outputElement2.textContent = "Congratulations! You Solved the Puzzle!";
           }
           else
           {
            outputElement2.textContent = "Puzzle is not Solved";
           }
           outputElement2.style.fontFamily = "Arial, sans-serif";

}

function getAdjacentPositions(i, j) {
    const adjacentPositions = [];

    if (i > 0) adjacentPositions.push([i - 1, j]); // Up
    if (i < size - 1) adjacentPositions.push([i + 1, j]); // Down
    if (j > 0) adjacentPositions.push([i, j - 1]); // Left
    if (j < size - 1) adjacentPositions.push([i, j + 1]); // Right

    return adjacentPositions;
}

function findEmptyPosition() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (pieces[i][j].textContent=='') {
                return [i, j];
            }
        }
    }
}

function swapPieces(i1, j1, i2, j2) {
    for (let i = 0; i < size; i++) {//removes all event handlers
            for (let j = 0; j < size; j++) {
                if(clickEventListeners[i][j]!=null)
                    pieces[i][j].removeEventListener('click', clickEventListeners[i][j]);
            }
        }
    const temp = pieces[i1][j1];
    pieces[i1][j1] = pieces[i2][j2];
    pieces[i2][j2] = temp;
}

function updatePiecePositions() {

        puzzleContainer.innerHTML = '';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const piece = pieces[i][j];
                //piece.textContent = [i,j];
                puzzleContainer.appendChild(piece); // Add the piece back to the container
            }
        }

}

function isPuzzleSolved() {
    const totalPieces = size * size;
        let expectedValue = 1;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (pieces[i][j].textContent !== '') {
                    const currentValue = parseInt(pieces[i][j].textContent);
                    if (currentValue !== expectedValue) {
                        // If any piece's value doesn't match the expected order, the puzzle is not solved
                        return false;
                    }
                    expectedValue++;
                } else if (i === size - 1 && j === size - 1) {
                    // If we reached the last piece (empty space) and it's at the expected position
                    return true;
                }
            }
        }
        return true; // If we reached here, the puzzle is solved
}

createPuzzle();
