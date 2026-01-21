const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^\+?\d(?:\s?\d){9,19}$/;
const onlyLettersPattern = /^[a-zA-Z\s-]+$/;
const cardPattern = /^(\d{4}\s){3}\d{4}$/;
const expDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;


const formElement = document.getElementById('checkoutForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');
const firstNameInput = document.getElementById('firstname');
const firstNameError = document.getElementById('firstnameError');
const lastNameInput = document.getElementById('lastname');
const lastNameError = document.getElementById('lastnameError');

let formCorrect = true;

emailInput.addEventListener('blur', validateEmail);
phoneInput.addEventListener('blur', validatePhone);
firstNameInput.addEventListener('blur', () =>
  validateName(firstNameInput, firstNameError),
);
lastNameInput.addEventListener('blur', () =>
  validateName(lastNameInput, lastNameError),
);

function validateEmail() {
  if (emailPattern.test(emailInput.value)) {
    emailError.innerText = '';
  } else {
    emailError.innerText =
      'Please enter correct email address (e.g. john@gmail.com)';
    formCorrect = false;
  }
}

function validatePhone() {
  if (phonePattern.test(phoneInput.value)) {
    phoneError.innerText = '';
  } else {
    phoneError.innerText =
      'Please enter correct phone number (e.g. 530 345 66 66)';
    formCorrect = false;
  }
}

function validateName(input, errorField) {
  if (input.value.length >= 50) {
    errorField.innerText = 'This field should contain less than 50 characters.';
    formCorrect = false;
  } else {
    if (onlyLettersPattern.test(input.value)) {
      errorField.innerText = '';
    } else {
      errorField.innerText = 'This field can only contain letters.';
      formCorrect = false;
    }
  }
}

formElement.addEventListener('submit', function (event) {
  event.preventDefault();

  formCorrect = true;
  validateEmail();
  validatePhone();
  validateName(firstNameInput, firstNameError);
  validateName(lastNameInput, lastNameError);

  if (formCorrect) {
    document.getElementById('success').classList.remove('hidden');
    formElement.classList.add('hidden');
  }
});
