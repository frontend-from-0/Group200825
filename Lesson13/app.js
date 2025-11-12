// Single-line comment: console.log('Hello world!');

/* 
Multi
line 
comment
 */

// Variables can be defined with keywords: let (changable variable), const (constant - non changable variable), var (acts like let, old keyword. Do not use)

// greeting - is a meaninful name that we select
const greetingWord = 'Hello World';

let name = 'Omer';

let year = 2002;

// true, false are keywords in JS
let isStudent = true;

let myNumber; // let myNumber = undefined;

// Re-assing value of variable name:
name = null;

let registration = {
  name: 'Ayse',
  age: 18,
  address: {
    street: 'apple street',
    city: 'Turkey',
    postCode: '06900',
  },
};

let registration2 = {
  name: 'Jane',
  age: 18,
  address: {
    street: 'apple street',
    city: 'Turkey',
    postCode: '06900',
  },
};

let registration3 = {
  name: 'John',
  age: 30,
  address: {
    street: 'apple street',
    city: 'Turkey',
    postCode: '06900',
  },
};

// , (coma) is a common separator in JS
const registrationRegister = [registration, registration2, registration3];
// In array, every value has an index. Indexing starts with 0 in arrays.

/* Address book

Use OBJECTS for each address
Use ARRAY to store all the addresses (objects)

*/

const firstAddress = {
  name: 'Refik',
  line1: '4827 West Maple Avenue, Building 4, Entrance C',
  line2: 'The Greenfield Residences 12B',
  city: 'Brooklyn, New York',
  postCode: '23456',
};

const secondAddress = {
  name: 'Refik',
  line1: '4827 West Maple Avenue, Building 4, Entrance C',
  line2: 'The Greenfield Residences 12B',
  city: 'Brooklyn, New York',
  postCode: '23456',
};
const addressBook = [firstAddress, secondAddress];

console.log(addressBook);

console.log('The year is: ', year, typeof year);

year = 'Two thousand ten';
console.log('The year is: ', year, typeof year);

let today = null;
console.log(typeof addressBook, Array.isArray(addressBook));
