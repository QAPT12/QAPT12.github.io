document.addEventListener("DOMContentLoaded", function(){

    const difficultyButtons = document.querySelectorAll('[id=difficultyButton]');

    for(let i = 0; i < difficultyButtons.length; i++){
        difficultyButtons[i].addEventListener("click", (evt) => {
            target = evt.target;
            if(target.value == "beginner"){
                var game = new Game("beginner");
            } else if (target.value == "intermediate"){
                var game = new Game("intermediate");
            } else if (target.value == "expert"){
                var game = new Game("expert");
            }

            const difficultySelections = document.getElementById("difficultySelections");
            while(difficultySelections.firstChild) {
                difficultySelections.firstChild.remove();
            }

            const mineCountLabel = document.createElement("label");
            mineCountLabel.innerHTML = "Mine Count: ";
            difficultySelections.appendChild(mineCountLabel);

            const mineCount = document.createElement("input");
            mineCount.id = "mineCounter";
            mineCount.disabled = true;
            mineCount.value = game.getMineCounter();
            difficultySelections.appendChild(mineCount);

            const timerLabel = document.createElement("label");
            timerLabel.innerHTML = "Time Elapsed: ";
            difficultySelections.appendChild(timerLabel);

            const timer = document.createElement("input");
            timer.id = "gameTimer";
            timer.disabled = true;
            difficultySelections.appendChild(timer);

            const revealedButtonsLabel = document.createElement("label");
            revealedButtonsLabel.innerHTML = "Cells Revealed: ";
            difficultySelections.appendChild(revealedButtonsLabel);

            const revealedButtonCounter = document.createElement("input");
            revealedButtonCounter.id = "revealedButtonCounter";
            revealedButtonCounter.disabled = true;
            difficultySelections.appendChild(revealedButtonCounter);

            
            // Timer stuff goes here
            let seconds = 0;
            let minutes = 0;
      
            const timerElement = document.getElementById("gameTimer");
      
            function updateTimer() {
              seconds++;
              if (seconds === 60) {
                seconds = 0;
                minutes++;
              }
      
              const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
              timerElement.value = formattedTime;
            }
      
            setInterval(updateTimer, 1000);
            // end of timer stuff

            
            const screenElement = document.getElementById("gameArea");
            if (screenElement) {
                game.constructButtons(screenElement);
            } else {
                console.error("Screen element not found.");
            }
        });
    }

});
