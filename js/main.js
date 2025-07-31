let passwordLength = document.querySelector("#password-length");
const btnGenerate = document.querySelector("#btn-generate");
let passwordArr = JSON.parse(localStorage.getItem("passwords")) || [];
const deleteAll = document.querySelector("#btn-delete-all");
const outputPassword = document.querySelector("#output-password");
passwordLength.addEventListener("input", (e) => {
  const value = passwordLength.value;
  const isNumberOnly = /^\d+$/.test(value);

  if (isNumberOnly) {
    // check range
    passwordLength.value = Math.max(1, Math.min(passwordLength.value, 40));
  } else {
    passwordLength.value = "";
  }
});

// set blur input
passwordLength.addEventListener("blur", () => {
  if (passwordLength.value === "") passwordLength.value = 10; // default value
});

btnGenerate.addEventListener("click", (e) => {
  const special = document.querySelector("#special");
  const numbers = document.querySelector("#numbers");

  let password = generatePassword(
    parseInt(passwordLength.value),
    numbers.checked,
    special.checked
  );

  // output-password

  outputPassword.innerHTML = password;
  saveInLocalStorage(password);
  displayResults();
});

function generatePassword(length, includeNumbers, includeSpacial) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:',.<>?";

  let pool = lowercase + uppercase;
  if (includeNumbers) pool += numbers;
  if (special) pool += special;

  let password = "";
  for (let index = 0; index < length; index++) {
    let randomIndex = Math.floor(Math.random() * pool.length);
    password += pool[randomIndex];
  }

  return password;
}

function saveInLocalStorage(password) {
  passwordArr.unshift(password);
  if (passwordArr.length > 15) passwordArr.pop();
  localStorage.setItem("passwords", JSON.stringify(passwordArr));
}

function displayResults() {
  // results
  if (passwordArr.length > 0) deleteAll.classList.remove("d-none");
  else deleteAll.classList.add("d-none");
  let divs = "";
  for (let index = 0; index < passwordArr.length; index++) {
    divs += `
         <div
          class="res d-flex  align-items-center justify-content-between flex-wrap gap-4 bg-white rounded-2 shadow mb-3 p-3"
        >
         <div class="d-flex flex-wrap   align-items-center gap-3" >
          <span
            style="width: 50px; height: 50px"
            class="res-number bg-info bg-opacity-75 text-white fs-3 d-flex fw-bold justify-content-center align-items-center rounded-circle"
            >${index + 1}</span
          >
          <span class="res-password text-info-emphasis text-break fs-3 fw-bold"
            >${passwordArr[index]}
          </span>
         </div>
        <button data-index="${index}" class="btn delete-item   fw-bold btn-danger bg-opacity-50" >Delete</button>
        </div>  
        `;
  }

  document.querySelector(".results").innerHTML = divs;

  document.querySelectorAll(".delete-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      deleteItem(index);
    });
  });
}

displayResults();

// btn-delete ALl

deleteAll.addEventListener("click", () => {
  localStorage.removeItem("passwords");
  passwordArr = [];
  outputPassword.innerHTML = "Password Will Appear Here";
  displayResults();
});

function deleteItem(index) {
  passwordArr.splice(index, 1);
  localStorage.setItem("passwords", JSON.stringify(passwordArr));
  displayResults();
}
