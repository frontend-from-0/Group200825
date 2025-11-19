/* 
Topic: JavaScript Basics

Focus: Variables, data types, arithmetic, strings, random numbers, template literals, increments
*/

// Instructions: Complete each exercise below by writing your code where indicated.

// 1. Declare variables firstNumber=5 and secondNumber=3 and log their sum.
const firstNumber = 5;
const secondNumber = 3;
console.log('Ex. 1:', 'Sum of the numbers: ', firstNumber + secondNumber);

// 2. Declare variables userName and userAge. Log a greeting: "Hello! I am (userName) and I am (userAge) years old."
let userName = 'Ahmet';
let userAge = 20;
// String concatination
console.log(
  'Ex. 2:',
  'Hello! I am ' + userName + ' and I am ' + userAge + ' years old.',
);
userName = 'Jane';
userAge = 40;
console.log(
  'Ex. 2:',
  'Hello! I am ' + userName + ' and I am ' + userAge + ' years old.',
);
// `string text ${expression} string text`
console.log('Ex. 2:', `Hello! I\'m ${userName} and I am ${userAge} years old.`);

// 3. Declare variables a=10 and b=4. Log the result of a-b, a*b, and a/b.
const a = 10;
const b = 4;

console.log('Ex. 3:', 'a-b=', a - b, 'a*b=', a * b, 'a/b=', a / b);

// 4. Use template literals to log: "My name is (userName). I like JS."

userName = 'Omer';
console.log('Ex.4', `My name is ${userName}. I like JS.`);

// 5. Declare a string password = "securePass". Log the length of password.
let password = 'securePass';
console.log('Ex. 5:', 'The length of password is ', password.length);

password = '123';
console.log('Ex. 5:', 'The length of password is ', password.length);

// 6. Convert the string "hello world" to uppercase and log it.
const originalText = 'hello world';
const upperCaseText = originalText.toUpperCase();

console.log(
  'Ex.6',
  originalText,
  `The uppercase version of the original text is: ${upperCaseText}`,
);

// 7. Concatenate "Hello" and "World" with a space in between and log the result.

// 8. Check the type of a variable, e.g., let x = 42. Log the type using typeof.

// 9. Convert the number 100 to a string and log the result.
const number = 100;
console.log('Ex.9', number, number.toString());
console.log('Ex.9', number, ""+number);

// 10. Convert the string "50" to a number and log its type to confirm the conversion.
const stValue = "50";
const nmValue = parseInt(stValue);
console.log("Ex. 10", "Type of that expression: ", typeof nmValue, Number(stValue));

// 11. Generate a random integer between 0 and 10 and log it.
const randomNumberWithRound = Math.round(Math.random() * 10);

// 5 to 15 including
const randomNumber = Math.floor(Math.random() * 11) + 5;

// 4 to 15
const randomNumber4To15 = Math.floor(Math.random() * 12) + 4;
// 15 - 4  = 11 (find random number between 0 and 11, then add 4 to the result)

// 0 - 0.9999 
// 0 - 9.99999 (multiplied by 10)
// 0 - 10.99 (multiplied by 11)


console.log('randomNumber', randomNumber, randomNumberWithRound);

// 12. Round the number 3.7 down using Math.floor and 3.2 up using Math.ceil, log both.

// 13. Declare a boolean variable isStudent = true. Log it.

// 14. Initialize counter = 0, then increment it by 1 using counter++ and log it.
let counter = 0;

// counter++ uses postfix increment (do operation first, then increment)
// ++counter uses prefix increment (increment first, than do any operations)

console.log('Ex.14','counter', counter++);
console.log('counter', 2+3);
console.log('counter', counter);


// 15. Initialize points = 10, add 5 to it using points += 5, then log points.

// 16. Declare name="Alice", age=30, city="Paris". Log "Alice (30) lives in Paris" using template literals.

// 17. Declare variables x=5, y=10, z=15. Log their total sum.

// 18. Declare dividend=10 and divisor=3. Log the quotient (divisionResult) and difference (differenceResult).

// 19. Declare firstName and lastName. Create fullName by concatenating them with a space and log it.

// 20. Declare firstFactor=7 and secondFactor=2. Log the product.

// 21. Log the value of Math.PI.

// 22. Declare counter=0. Increment it using three different methods (e.g., counter++, counter+=1, counter=counter+1) and log the result each time.

// 23. Declare initialTemperature=20. Increase it by 5 and log the result.

// 24. Declare numberEx9=6. Increment it using the prefix ++ operator and log both the variable and the incremented value.

// 25. Declare numberEx10=8. Increment it using the postfix ++ operator and log both the original variable and the incremented value.

// 26. Declare numberEx11=-3. Increment it by 1 using prefix ++, then multiply the result by 2 and log the final value.

// 27. Declare a=2 and b=3. Increment a using the prefix ++ operator, then add b to the result and log it.
