// Arrays 
// Basic Example
const numbers = ['hello', null, true, undefined, function () {console.log(hello);}];

// Without destructuring
// const firstEl = numbers[0];
// const secondEl = numbers[1];

// With destructuring
// const [firstEl, secondEl, thirdEl, fourthEl, fifthEl] = numbers;


// Skipping Elements
// const [firstEl, , , , fifthEl] = numbers;



// Using Rest Parameters to Capture the Rest of the Elements
// const [, , ...remaningElementsArray] = numbers;


// Default Values (replaced undefined but not null or other falsy values!!)
// const [name, surname = 'Surname is missing', phone = 'The number is missing'] = ['john', null, undefined];
// console.log(name, surname, phone);


// Objects
// Basic Usage

const person = {
  name: 'Alice',
  age: 30,
  job: 'Engineer',
  isStudent: true
};

// Without destructuring
// const name = person[name];
// const job = person[job];

// With destructuring
// const {name, job} = person;
// console.log('job', job, 'name', name);

// Renaming Variables
// const {name: firstName, job: jobTitle} = person;
// console.log('job', jobTitle, 'name', firstName);


// Default Values
// const {name: firstName, job: jobTitle = 'N/A', address = 'N/A'} = person;
// console.log('job', jobTitle, 'name', firstName, 'address', address);

// Nested Objects

const personWithContactInfo = {
  name: 'Dave',
  age: 32,
  contact: {
    email: 'dave@example.com',
    phone: '123456789',
    address: {
      line1: "Kungstagatan 1",
      postcode: '444222'
    }
  }
};

// const {name: firstName, contact: {address: {postcode}}} = personWithContactInfo;
// console.log('name', firstName, 'address', address);



// Rest Properties
const {name, age, ...otherInfo} = personWithContactInfo;

console.log('name', name, 'age', age, otherInfo);



