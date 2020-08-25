document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let squares = [];
    let bombAmount = 20;
    let isGameOver = false;
    let flags = 0;

    //create board
    function createBoard() {
        //gett shuffled game array with random bombs
        //created board
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = shuffle(gameArray);


        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i])
            grid.appendChild(square);
            squares.push(square)

            //normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            //right click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square)
            }
        }



        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }

        }

        showTotals();
    }

    createBoard();

    //shuffle array
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array
    }

    // add flags
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                checkForWin()
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }
        }
    }

    //click on square acttion
    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked');
    }

    //check neighbor squares
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId > 10) {
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);

                click(newSquare);
            };


        }, 10)
    }

    //game over
    function gameOver(square) {

        isGameOver = true;
        document.getElementById('reset').classList.remove('hidden');

        //show all bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        });
        alert('Boom! Game over.');
    }

    //check for win
    function checkForWin() {
        let matches = 0;
        showTotals();
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount) {
                alert('You Win!')
                isGameOver = true;
                document.getElementById('reset').classList.remove('hidden');
            }
        }
    }

    function showTotals() {
        const bombsTotals = document.getElementById('bombs-total');
        const flagsTotals = document.getElementById('flags-total');
        flagsTotals.innerHTML = flags;
        bombsTotals.innerHTML = bombAmount - flags;
    };

    document.getElementById('resetBtn').onclick = resetGame;

    function resetGame() {

        console.log('running')

        while (grid.hasChildNodes()) {
            grid.removeChild(grid.firstChild)
        }
        document.getElementById('reset').classList.add('hidden');
        flags = 0
        isGameOver = false;
        squares = [];
        createBoard();
    }

})

