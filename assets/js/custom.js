document.addEventListener("DOMContentLoaded", function () {

  const fields = {
    name: document.getElementById("NameInput"),
    lastname: document.getElementById("LNameInput"),
    email: document.getElementById("EmailInput"),
    phone: document.getElementById("NMInput"),
    adress: document.getElementById("AdressInput"),
    q1: document.getElementById("Q1Input"),
    q2: document.getElementById("Q2Input"),
    q3: document.getElementById("Q3Input")
  };

  const submitBtn = document.querySelector(".submit-btn");
  const resultDiv = document.getElementById("result");
  const popup = document.getElementById("popup");

  submitBtn.disabled = true; // pradžioje disabled

  // --- Validacijos funkcijos ---
  function isLettersOnly(value){
    return /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/.test(value);
  }

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value){
    // +370 6XX XXXXX
    return /^\+370 6\d{2} \d{5}$/.test(value);
  }

  function validateField(key, value){
    switch(key){
      case "name":
      case "lastname":
        return value && isLettersOnly(value);
      case "email":
        return value && isValidEmail(value);
      case "phone":
        return value && isValidPhone(value);
      case "adress":
      case "q1":
      case "q2":
      case "q3":
        return !!value;
      default:
        return false;
    }
  }

  function markField(input, isValid){
    input.style.borderColor = isValid ? "green" : "red";
  }

  // --- Telefono formatavimas realiu laiku ---
  fields.phone.addEventListener("input", function(e){
    let val = this.value.replace(/\D/g,''); // pašaliname viską, kas ne skaičius

    // Visada +370 pradžia
    if(!val.startsWith('370')) val = '370' + val.replace(/^0/,''); 

    // Tik maksimalus ilgis: 3706XXXXXXX -> 11 skaitmenų
    val = val.slice(0,11);

    // Formatuojame: +370 6XX XXXXX
    let formatted = '+';
    formatted += val.slice(0,3) + ' ';   // 370
    if(val.length >= 4) formatted += val.slice(3,6) + ' '; // 6XX
    if(val.length >= 7) formatted += val.slice(6); // XXXXX

    this.value = formatted;

    // Patikriname ir nuspalviname laukelį
    markField(this, isValidPhone(this.value));

    // Tikriname ar viskas teisinga
    checkAllFields();
  });

  // Tikrina visus laukus ir aktyvuoja mygtuką
  function checkAllFields(){
    let allValid = true;
    Object.keys(fields).forEach(key=>{
      const val = fields[key].value.trim();
      const valid = validateField(key, val);
      markField(fields[key], valid);
      if(!valid) allValid = false;
    });
    submitBtn.disabled = !allValid;
    return allValid;
  }

  // Real-time tikrinimas kitiems laukams
  Object.keys(fields).forEach(key=>{
    if(key !== 'phone'){ // phone jau turi savo event
      fields[key].addEventListener("input", checkAllFields);
    }
  });

  // Submit
  submitBtn.addEventListener("click", function(){
    if(!checkAllFields()){
      resultDiv.innerHTML = "<p style='color:red;'>Visi laukeliai turi būti užpildyti teisingai!</p>";
      return;
    }

    const data = {};
    Object.keys(fields).forEach(key=>{
      data[key] = fields[key].value.trim();
    });

    // Sėkmingo pateikimo popup
    popup.style.display = "block";
    setTimeout(()=>popup.style.display="none",3000);

    // Apskaičiuojame Q1-Q3 vidurkį
    const q1Options = [["Raudona","Oranžinė","Geltona","Žalia","Mėlyna","Violetinė","Ruda","Rožinė","Juoda","Balta"],[10,9,8,7,6,5,4,3,2,1]];
    const q2Options = [["Titanikas","Avataras","Žiedų valdovas","Inception","Matrix","Forrest Gump","Joker","Gladiatorius","Harry Potter","La La Land"],[10,9,8,7,6,5,4,3,2,1]];
    const q3Options = [["BMW","Mercedes","Audi","Tesla","Toyota","Volkswagen","Honda","Ford","Porsche","Ferrari"],[10,9,8,7,6,5,4,3,2,1]];

    function evalAnswer(answer, options){
      const idx = options[0].indexOf(answer);
      return idx === -1 ? 0 : options[1][idx];
    }

    const total = (evalAnswer(data.q1,q1Options) + evalAnswer(data.q2,q2Options) + evalAnswer(data.q3,q3Options))/3;

    // Rezultato atvaizdavimas
    resultDiv.innerHTML = `
      <h3>Įvesti duomenys:</h3>
      <p><strong>Vardas:</strong> ${data.name}</p>
      <p><strong>Pavardė:</strong> ${data.lastname}</p>
      <p><strong>El. paštas:</strong> ${data.email}</p>
      <p><strong>Tel. numeris:</strong> ${data.phone}</p>
      <p><strong>Adresas:</strong> ${data.adress}</p>
      <p><strong>Klausimas 1:</strong> ${data.q1}</p>
      <p><strong>Klausimas 2:</strong> ${data.q2}</p>
      <p><strong>Klausimas 3:</strong> ${data.q3}</p>
      <h3>Vidurkis:</h3>
      <p>${data.name} ${data.lastname}: ${total.toFixed(1)}</p>
    `;
  });






const cardData = ['🍎','🍌','🍇','🍉','🍓','🥝','🍒','🍍','🥭','🍑','🍋','🍊'];

const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const board = document.getElementById('gameBoard');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const winMessage = document.getElementById('winMessage');

// Nauji elementai: laikmatis ir geriausias rezultatas
const timerEl = document.createElement('p');
const bestEl = document.createElement('p');
timerEl.textContent = "Laikas: 0s";
bestEl.textContent = "Geriausias rezultatas: -";
document.querySelector('.stats').appendChild(timerEl);
document.querySelector('.stats').appendChild(bestEl);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let totalPairs = 0;

let timer = null;
let seconds = 0;

function initGame() {
    // Sustabdyti laikmatį jei buvo
    clearInterval(timer);
    seconds = 0;
    timerEl.textContent = "Laikas: 0s";

    const difficulty = difficultySelect.value;
    let rows, cols;
    if(difficulty === 'easy') { rows = 3; cols = 4; }
    else { rows = 4; cols = 6; }

    totalPairs = (rows * cols)/2;
    moves = 0; matches = 0;
    movesEl.textContent = moves;
    matchesEl.textContent = matches;
    winMessage.classList.add('hidden');

    // Rodyti geriausią rezultatą iš localStorage
    const bestKey = `best_${difficulty}`;
    const best = localStorage.getItem(bestKey);
    bestEl.textContent = `Geriausias rezultatas: ${best ? best : '-'}`;

    // Generuoti korteles
    const neededCards = cardData.slice(0, totalPairs);
    const pairedCards = [...neededCards, ...neededCards];
    shuffleArray(pairedCards);

    // Sukurti lentą
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    pairedCards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    // Pradėti laikmatį
    timer = setInterval(() => {
        seconds++;
        timerEl.textContent = `Laikas: ${seconds}s`;
    }, 1000);
}

function flipCard() {
    if(lockBoard) return;
    if(this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;

    if(!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        moves++;
        movesEl.textContent = moves;

        if(firstCard.dataset.symbol === secondCard.dataset.symbol) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            resetTurn();
            matches++;
            matchesEl.textContent = matches;
            if(matches === totalPairs) endGame();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.textContent = '';
                secondCard.textContent = '';
                resetTurn();
            }, 1000);
        }
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function endGame() {
    clearInterval(timer);
    winMessage.classList.remove('hidden');

    // Patikrinti ir išsaugoti geriausią rezultatą
    const difficulty = difficultySelect.value;
    const bestKey = `best_${difficulty}`;
    const best = localStorage.getItem(bestKey);
    if(!best || moves < parseInt(best)) {
        localStorage.setItem(bestKey, moves);
        bestEl.textContent = `Geriausias rezultatas: ${moves}`;
    }
}

function shuffleArray(array) {
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startBtn.addEventListener('click', initGame);
resetBtn.addEventListener('click', initGame);

// Nuskaityti geriausią rezultatą puslapio įkrovimo metu
window.addEventListener('DOMContentLoaded', () => {
    ['easy','hard'].forEach(level => {
        const best = localStorage.getItem(`best_${level}`);
        if(best) console.log(`Geriausias ${level}: ${best} ėjimai`);
    });
});

















































  

});

