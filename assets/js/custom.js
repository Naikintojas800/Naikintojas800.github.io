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

});

