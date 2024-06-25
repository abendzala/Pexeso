document.addEventListener("DOMContentLoaded", () => {
  const words = ['Cat', 'Dog', 'Elephant', 'Lion', 'Tiger', 'Monkey'];
  const images = [
      'Chmelar.jpg',
      'chskym.png',
      'volchodit.jpg'
  ];
  const sounds = [
    'tukabel-po-penezi-uzival-na-automatoch.mp3',
    'krikraskis.mp3',
    'toto-je-v-pici.mp3'
  ];

  let currentSound = null; // To keep track of the currently playing sound

  document.getElementById('start-game').addEventListener('click', () => {
      const gameType = document.getElementById('game-type').value;
      if (gameType === 'words') {
          newGame(words, 'words');
      } else if (gameType === 'images') {
          newGame(images, 'images');
      } else if (gameType === 'sounds') {
          newGame(sounds, 'sounds');
      }
  });

  function newGame(valueSet, type) {
      let numberOfCards = valueSet.length * 2; // Ensure this is an even number
      let cardList = [];
      let firstCard = null;
      let secondCard = null;
      let playerOneScore = 0;
      let playerTwoScore = 0;
      let isCheckingForMatch = false;
      let currentPlayer = 1;

      const gameBoard = document.getElementById("game-board");
      const turnInfo = document.getElementById("turn-info");
      const scoreInfo = document.getElementById("score");
      const matchIndicator = document.getElementById("match-indicator");

      // Clear previous game board
      gameBoard.innerHTML = '';

      fillCards(cardList, numberOfCards, valueSet);

      for (let i = 0; i < numberOfCards; i++) {
          const card = document.createElement("div");
          card.classList.add("card", "hidden");
          let randomItem = Math.floor(Math.random() * cardList.length);
          card.dataset.value = cardList[randomItem];
          card.id = "card" + i;
          cardList.splice(randomItem, 1);
          card.addEventListener('click', () => flipCard(card, type));
          gameBoard.appendChild(card);
      }

      turnInfo.innerText = `Player 1's turn`;
      scoreInfo.innerText = `Player 1: 0 | Player 2: 0`;

      function fillCards(list, howMany, values) {
          for (let i = 0; i < howMany / 2; i++) {
              list.push(values[i], values[i]);
          }
          return list;
      }

      function flipCard(card, type) {
          if (isCheckingForMatch) {
              return;
          }
          if (card.classList.contains('hidden')) {
              card.classList.remove('hidden');

              if (type === 'words') {
                  card.innerText = card.dataset.value;
                  card.style.backgroundColor = '#ffffff';
                  card.style.color = '#000000'; 
              } else if (type === 'images') {
                  card.innerHTML = `<img src="${card.dataset.value}" alt="image" class="img-fluid">`;
                  card.style.backgroundColor = '#ffffff'; 
              } else if (type === 'sounds') {
                  card.innerHTML = `<span class="music-note">🎵</span>`;
                  card.querySelector('.music-note').style.display = 'inline';
                  if (currentSound) {
                      currentSound.pause();
                      currentSound.currentTime = 0;
                  }
                  currentSound = new Audio(card.dataset.value);
                  currentSound.play();
              }

              if (!firstCard) {
                  firstCard = card;
              } else if (!secondCard) {
                  secondCard = card;
                  isCheckingForMatch = true;
                  setTimeout(() => checkForMatch(), 200); 
              }
          }
      }

      function checkForMatch() {
          if (firstCard.dataset.value === secondCard.dataset.value) {
              updateScore();
              showIndicator(true);
              resetCards(true);
          } else {
              showIndicator(false);
              setTimeout(() => {
                  resetCards(false);
                  switchPlayer();
              }, 1000);
          }
      }

      function showIndicator(isCorrect) {
          matchIndicator.classList.remove('correct', 'wrong');
          if (isCorrect) {
              matchIndicator.classList.add('correct');
              matchIndicator.innerText = '✔ Correct!';
          } else {
              matchIndicator.classList.add('wrong');
              matchIndicator.innerText = '✘ Wrong!';
          }
          matchIndicator.style.display = 'block';
          setTimeout(() => {
              matchIndicator.style.display = 'none';
          }, 1000);
      }

      function resetCards(match) {
          if (!match) {
              firstCard.classList.add('hidden');
              secondCard.classList.add('hidden');
              firstCard.innerHTML = '';
              secondCard.innerHTML = '';
          }
          firstCard = null;
          secondCard = null;
          isCheckingForMatch = false;
          currentSound = null; 
      }

      function updateScore() {
          if (currentPlayer === 1) {
              playerOneScore++;
          } else {
              playerTwoScore++;
          }
          scoreInfo.innerText = `Player 1: ${playerOneScore} | Player 2: ${playerTwoScore}`;
          if (playerOneScore + playerTwoScore === numberOfCards / 2) {
              endGame();
          }
      }

      function switchPlayer() {
          currentPlayer = currentPlayer === 1 ? 2 : 1;
          turnInfo.innerText = `Player ${currentPlayer}'s turn`;
      }
  }

  function endGame() {
      alert("GAME OVER");
      location.reload(); 

      let timer = 30;
  }
});
