/**
 * JavaScript class for Minesweeper game.
 * 
 * @author quintin tuck
 */
class Game{

    /**
     * constructor for the game class. takes difficulty and sets the board dimensions and amount of mines.
     * 
     * @param difficulty difficulty for the game, ("beginner", "intermediate", "expert")
     */
    constructor(difficulty){
        this.difficulty = difficulty;
        this.board = [];

        if(this.difficulty == "beginner"){
            this.width = 9;
            this.height = 9;
            this.mines = 10;
        }
        if(this.difficulty == "intermediate"){
            this.width = 16;
            this.height = 16;
            this.mines = 40;
        }
        if(this.difficulty == "expert"){
            this.width = 20;
            this.height = 24;
            this.mines = 99;
        }

        this.buttonsToReveal = (this.height * this.width) - this.mines;
        this.mineCounter = this.mines;
        this.revealedButtons = 0;

        for(let i = 0; i < this.height; i++){
            this.board.push([]);
        }

        this.fillGameBoard();
        this.placeMines();
        this.calculateNumbers();
    }

    /**
     * getMineCounter.
     * 
     * @returns number of mines on board.
     */
    getMineCounter() {
        return this.mineCounter;
    }

    /**
     * fillGameBoard. Creates an array of array that can represent a minesweeper game grid.
     * initially all the values of each item in the grid is set to 0.
     * 
     */
    fillGameBoard(){
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.width; j++){
                this.board[i].push("0");
            }
        }
    }

    /**
     * placeMines. Randomly place mines in the board array.
     */
    placeMines() {
        for (let i = 0; i < this.mines; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.height);
                col = Math.floor(Math.random() * this.width);
            } while (this.board[row][col] == 'M');
            this.board[row][col] = 'M';
        }
    }

    /**
     * calculateNumbers. Loops through all the buttons and calls the count adjacent mines function on any buttons that
     * are not mines.
     */
    calculateNumbers() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.board[row][col] !== 'M') {
                    this.board[row][col] = this.countAdjacentMines(row, col);
                }
            }
        }
    }

    /**
     * countAdjacentMines. Looks at the buttons around the buttons being searched and counts how many of those contain mines.
     * 
     * @param row the row in the grid where the button pressed is located.
     * @param col the col in the grid where the button pressed is located.
     * 
     * @returns count of mines around the checked button.
     */
    countAdjacentMines(row, col) {
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];

        let count = 0;
        for (const [x, y] of directions) {
          const newRow = row + x;
          const newCol = col + y;
          if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width) {
            if (this.board[newRow][newCol] === 'M') {
              count++;
            }
          }
        }

        return count;
    }


    /**
     * constructButtons. Builds the buttons for the minesweeper game.
     * adds dataset values to the button to show its position in the grid as well as sets up all event listeners to
     * handle the button clicks.
     * 
     * @param screen the div/ area on the page to fill with the buttons
     */
    constructButtons(screen){
        console.log("constructing buttons...");

        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.board.length; j++){
                const newButton = document.createElement("button");
                newButton.dataset.row = i;
                newButton.dataset.col = j;
                newButton.dataset.revealed = false;
                newButton.dataset.flagged = true;
                newButton.addEventListener("click", ()=> this.handleButtonClick(i, j));
                newButton.addEventListener("contextmenu", (event)=> {
                    event.preventDefault();
                    this.handleRightButtonClick(i, j);
                });
                screen.appendChild(newButton); 
            }
            screen.appendChild(document.createElement("br"));
        }
    }

    /**
     * handleButtonClick. handles the standard button click to reveal a tile.
     * if the value of the tile revealed is 0 it will call the function to reveal the cells around it.
     * if the value of the button is 'M' an alert will tell the player they have lost the game.
     * 
     * @param row the row in the grid where the button pressed is located.
     * @param col the col in the grid where the button pressed is located.
     */
    handleButtonClick(row, col) {
        const cell = this.board[row][col];
        const button = document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);

        if (!button.flagged){
  
            if (!button.revealed) {
                button.revealed = true;
                button.innerHTML = cell;
                button.style.background='var(--reveal)';

                this.revealedButtons += 1;
                this.updateRevealedButtonsCount();

                this.buttonsToReveal -= 1;
                if(this.buttonsToReveal == 0) {
                    this.winGame();
                }
            
                if (cell === 0) {
                    this.revealZeroCells(row, col);
                }
            
                if (cell == 'M') {
                    this.loseGame();
                }
            }
        }
    }

    /**
     * handleRightButtonCLick. Flags or un-Flags the button pressed based on its current flagged status.
     * 
     * @param row the row in the grid where the button pressed is located.
     * @param col the col in the grid where the button pressed is located.
     */
    handleRightButtonClick(row, col) {
      
      const button = document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);
  
      if(!button.flagged && !button.revealed) {
          button.flagged = true;
          button.innerHTML = '<i class="fa-solid fa-flag" style="color: #ff0000;"></i>';
          this.mineCounter -= 1;
      } else if (button.flagged && !button.revealed) {
          button.flagged = false;
          button.innerHTML = '';
          this.mineCounter += 1;
      }
      this.updateMineCounterDisplay();
    }

    updateMineCounterDisplay() {
        const display = document.getElementById("mineCounter");
        display.value = this.mineCounter;
    }

    updateRevealedButtonsCount(){
        const revealedButtonCounter = document.getElementById("revealedButtonCounter");
        revealedButtonCounter.value = this.revealedButtons;
    }

    /**
     * revealZeroCells. Looks at the buttons around the button that was clicked to call the function.
     * if the value of the revealed cell is also a 0 it will call the function recursively until all possible
     * values have been revealed.
     * 
     * @param row the row in the grid where the button pressed is located.
     * @param col the col in the grid where the button pressed is located.
     */
    revealZeroCells(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [x, y] of directions) {
            const newRow = row + x;
            const newCol = col + y;
            if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width) {
                const cell = this.board[newRow][newCol];
                const button = document.querySelector(`button[data-row="${newRow}"][data-col="${newCol}"]`);

                if (!button.revealed) {
                    button.revealed = true;
                    button.innerHTML = cell;
                    button.style.background='var(--reveal)';
                    this.revealedButtons += 1;
                    this.updateRevealedButtonsCount();
                    this.buttonsToReveal -= 1;
                    if(this.buttonsToReveal == 0) {
                        this.winGame();
                    }   

                    if (cell == 0) {
                        this.revealZeroCells(newRow, newCol);
                    }
                } 
            }
        }
    }

    
    /**
     * You did it. Im proud of you. Enjoy the story.
     */
    winGame(){
        swal("Well done Comrade!!", "You, the esteemed player, successfully swept away all the mines that threatened the motherland.\n\n" +
        "As the last mine was uncovered in the virtual realm, a wave of relief washed over Minevonia. Citizens who had been hiding in bunkers and shelters emerged cautiously, blinking in the sudden sunlight as if they'd just witnessed a miracle. The air was filled with a palpable sense of freedom, and the people collectively sighed, 'Слава герою!' – 'Glory to the hero!'\n\n" +
        "News of your heroic deeds spread like wildfire through the tightly controlled state-run media. Comrade Bombov himself issued a decree, declaring a new national holiday in your honor – 'Minevonia Liberation Day.' The entire country erupted in jubilation, and citizens took to the streets, waving miniature Minesweeper flags and chanting, 'No more hidden threats, only uncovered joy!'\n\n" +
        "The government, always resourceful in leveraging propaganda, plastered posters of your victorious Minesweeper avatar across the capital city. The heroic pixelated figure became a symbol of hope and courage, replacing the stern faces of the usual political leaders on public murals.\n\n" +
        "On Minevonia Liberation Day, parades marched through the streets, featuring floats adorned with oversized mines being comically swept away by animated brooms. The national anthem was temporarily replaced by a catchy Minesweeper-themed jingle that played from loudspeakers strategically placed on every street corner.\n\n" +
        "In an unexpected turn of events, Comrade Bombov even declared a special pardon for the notorious 'Flag Planters,' who were previously exiled to the notorious Minesweep Gulag for their alleged crimes of planting flags without proper authorization.\n\n" +
        "And so, in the aftermath of the mines being swept and removed, Minevonia transformed into a land of joy, celebration, and freedom. Thanks to your unwavering commitment to the art of Minesweeper, the citizens of Minevonia could now rest easy, enjoying the newfound holiday and the liberties it brought.\n\n" + 
        "Time Elapsed: " + document.getElementById("gameTimer").value + "   Tiles Revealed: " + document.getElementById("revealedButtonCounter").value,
        {button: "Play Again"})
        .then(() => {
            location.reload();
        });
    }

    /**
     * Unlucky? Skill issue?
     */
    loseGame(){
        swal("Oh dear, brave player.", "Alas, the mines proved mightier than even your strategic prowess.\n\n" +
        "As the mine erupted in a blaze of pixelated catastrophe, a somber cloud settled over Minevonia. Citizens recoiled in shock. The air, once filled with hope, now hung heavy with the weight of defeat. A collective sigh echoed through the virtual realm, 'Герой пал' – 'The hero has fallen.'\n\n" +
        "News of the unfortunate turn of events spread like wildfire through the tightly controlled state-run media. Comrade Bombov himself issued a decree, declaring a day of mourning in the memory of the valiant player who dared to challenge the treacherous mines – 'Minevonia Remembrance Day.' The entire country donned shades of gray, and citizens moved through the streets with bowed heads, contemplating the fragility of pixelated life.\n\n" +
        "The government, though masters of propaganda, struggled to find an image to capture the essence of defeat. The once-vibrant posters of your Minesweeper avatar were quietly removed, replaced by images of a lone, toppled flag.\n\n" +
        "On Minevonia Remembrance Day, somber processions marched through the streets. Instead of floats adorned with celebrations, there were empty spaces left for what could have been. The national anthem played mournfully from loudspeakers, a haunting melody that echoed through the now-silent corners of the city.\n\n" +
        "In an unprecedented gesture, Comrade Bombov declared a moment of silence for the 'Flag Planters,' who had been vilified for their antics but were now seen as tragic heroes who dared to challenge fate. The citizens, their spirits dampened, gathered in quiet reflection.\n\n" +
        "And so, in the aftermath of defeat, Minevonia transformed into a land of contemplation, reflection, and remembrance. The citizens, once filled with exuberance, now carried the weight of pixelated loss. Your valiant attempt may have ended in defeat, but the memory of your daring Minesweeper expedition would forever linger in Minevonia's history, a poignant reminder of the perils that lay beneath the surface.\n\n" + 
        "Time Elapsed: " + document.getElementById("gameTimer").value + "   Tiles Revealed: " + document.getElementById("revealedButtonCounter").value,
        {button: "Play Again"})
        .then(() => {
            location.reload();
        });
    }

}

