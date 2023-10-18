document.addEventListener('DOMContentLoaded', () => {
    let board = null; //
    const game = new Chess();
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1; 
    let userColor = 'w'; 




    // Function to make a random move for the computer
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if(game.game_over()){
            alert("Chackmate!")
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length); 
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen()); 
            recordMove(move, moveCount); // rec & display the move with move count
            moveCount++; // Increament the move count
        }
    }; 

    //Function to record and display the move history
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`; 
        moveHistory.textContent += formattedMove + ' '; 
        moveHistory.scrollTop = moveHistory.scrollHeight; // Auto-scroll to lastest move
    }; 

    // Function to handle the start of a drag position
    const onDragStart = (source, piece) => {
        //Allow the user frag only own pieces based on color 
        return !game.game_over() && piece.search(userColor) === 0; 
    }; 

    // Function to handle a piace drop on the board
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target, 
            promotion: 'q', 
        }); 

        if(move === null) return 'snapback'; 

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // rec & display the move with move count
        moveCount++; 
    };

    // Functiuon to handle the end of a piece snap animation
    const onSnapEnd = () => {
        board.position(game.fen()); 
    }; 

    // Configuration options for the board
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start', 
        onDragStart, 
        onDrop, 
        onSnapEnd, 
        moveSpeed: 'medium', 
        snapBackSpeed: 500, 
        snapSpeed: 100,
    }; 

    // Initialize the chessboard 
    board = Chessboard('board', boardConfig);

    // Event listener for the "Play Again" button 
    document.querySelector('.play-again').addEventListener
    ('click', () => {
        game.reset();
        board.start(); 
        moveHistory.textContent = ' ';
        moveCount = 1; 
        userColor = 'w';
    }); 

    // Event listener for the ""Set Position" button 
    document.querySelector('.set-pos').addEventListener
    ('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!"); 
        if(fen !== null){
            if(game.load(fen)){
                board.position(fen); 
                moveHistory.textContent = ' ';
                moveCount = 1; 
                userColor = 'w';
            } else {
                alert("Invalid FEN notation. Please try again!");
            }
        }
    });

    // Event listener for the "Flip Board" button
    document.querySelector('.flip-board').addEventListener
    ('click', () => {
        board.flip(); 
        makeRandomMove(); 
        // Toggle user's color after fliping the board
        userColor = userColor === 'w' ? 'b' : 'w';
    }); 
});
