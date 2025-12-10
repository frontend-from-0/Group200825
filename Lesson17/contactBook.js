/*
===========================================================
  SIMPLE CONTACT BOOK APPLICATION
===========================================================
In this project, you'll create a Contact Book to store and
manage basic info: name, phone, and email.

You'll practice:
1. Arrays and objects
2. Loops (for, for-of, findIndex, etc.)
3. Conditionals (if-else)
4. Basic CRUD (Create, Read, Update, Delete) functionality

Below is a step-by-step guide, with sample code and 
comments explaining what each section does. Run this file
in Node.js or in your browser's console to see the output.
*/

/*
-----------------------------------------------------------
  STEP 1: Setup and Initial Data
-----------------------------------------------------------
1. Create an array named 'contacts' with a few initial 
   sample contacts.
2. Each contact is an object with 'name', 'phone', and 
   'email' properties.
*/
const contacts = [
  { name: 'John Doe', phone: '123 456 789', email: 'john@blabla.com' },
  { name: 'John', phone: '123 456 789', email: 'john@gmail.com' },
  { name: 'Jane Doe', phone: '032 889 789', email: 'jane@blabla.com' },
];

/*
-----------------------------------------------------------
  STEP 2: Display All Contacts
-----------------------------------------------------------
Function: displayAllContacts()
- Loops over the 'contacts' array.
- Logs a descriptive string for each contact.

Example output:
  Name: Alice, Phone: 123-456-7890, Email: alice@example.com
*/
function displayAllContacts() {
  console.log('------------------');
  console.log('Displaying all contacts...');
  for (let i = 0; i < contacts.length; i++) {
    const currentContact = contacts[i];

    console.log(
      `Name: ${currentContact.name}, Phone: ${currentContact.phone}, Email: ${currentContact.email}`,
    );
  }
  console.log('End of contact list.');
  console.log('------------------');
}
/*
-----------------------------------------------------------
  STEP 3: Add a New Contact
-----------------------------------------------------------
Function: addContact(name, phone, email)
- Creates a new contact object and pushes it into 'contacts'.
- Checks if a contact with the same name already 
  exists before adding. If found, logs a warning and returns.
- Logs "Contact added successfully." if everything is good.
*/

function addContact(name, phone, email) {
  console.log('------------------');
  console.log(`Adding a contact with name ${name}...`);
  const newContact = {
    name,
    phone,
    email,
  };
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name) {
      console.warn(
        `Contact with name ${name} already exists. \nContact in the list: Name: ${contacts[i].name}, email: ${contacts[i].email}, phone: ${contacts[i].phone}}`,
      );
      return;
    }
  }
  contacts.push(newContact);
  console.log('Contact added successfully.');
  console.log('------------------');
}

/*
-----------------------------------------------------------
  STEP 4: View a Contact by Name
-----------------------------------------------------------
Function: viewContact(name)
- Loops over 'contacts' to find one matching 'name'.
- Logs the contact info if found.
- Otherwise, logs: "No contact found with the name: <name>"
*/

function viewContact(name) {
  console.log('------------------');
  console.log(`Viewing a contact with name ${name}...`);

  let count = 0;

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name) {
      console.log(
        `Name: ${contacts[i].name}, Phone: ${contacts[i].phone}, Email: ${contacts[i].email}`,
      );
      count++;
    }
  }

  if (count === 0) {
    console.log(`No contact found with the name: ${name}`);
  }

  console.log('------------------');
}

/*
-----------------------------------------------------------
  STEP 5: Update a Contact
-----------------------------------------------------------
Function: updateContact(name, newPhone, newEmail)
- Finds the contact by name and updates phone + email.
- Logs "Contact updated successfully." if found.
- Otherwise, logs: "No contact found with the name: <name>"
*/
function updateContact(name, newPhone, newEmail) {
  console.log('------------------');
  console.log(`Updating a contact with name ${name}...`);

  for (const contact of contacts) {
    if (contact.name === name) {
      contact.phone = newPhone;
      contact.email = newEmail;
      console.log('Contact updated successfully.');
      return;
    }
  }
  console.log(`No contact found with the name: ${name}`);
  console.log('------------------');
}
/*
-----------------------------------------------------------
  STEP 6: Remove a Contact
-----------------------------------------------------------
Function: removeContact(name)
- Finds the index of the contact with 'name' using 
  findIndex() or a loop.
- Splices it from the array if found.
- Logs "Contact removed successfully." if found.
- Otherwise, logs: "No contact found with the name: <name>"
*/
function removeContact(name) {
  console.log('------------------');
  console.log(`Removing a contact with name ${name}...`);

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name) {
      contacts.splice(i, 1);
      console.log('Contact removed successfully.');
      console.log('------------------');
      return;
    }
  }
  console.log(`No contact found with the name: ${name}`);
  console.log('------------------');
}

/*
-----------------------------------------------------------
  STEP 7: Testing Our Functions
-----------------------------------------------------------
Below are some sample function calls to demonstrate the 
Contact Book in action.
*/

displayAllContacts();

addContact('John', '123 456 789', 'john@blabla.com');
addContact('Mary', '000 456 789', 'mary@domain.com');
addContact('Sofie', '100 456 789', 'sofie@domain.com');
addContact('Sofie', '100 456 789', 'sofie@domain.com');

displayAllContacts();

viewContact('Mary');
viewContact('John');
viewContact('David');

updateContact('Mary', '111 456 789', 'mary@gmail.com');
updateContact('David', '111 456 789', 'david@gmail.com');

viewContact('Mary');

displayAllContacts();
removeContact('Mary');
removeContact('David');
displayAllContacts();

/*
-----------------------------------------------------------
  OPTIONAL ENHANCEMENTS:
-----------------------------------------------------------
1. Partial Name Search:
   - Instead of strict ===, use .includes() for the name check.

2. Sort Contacts:
   - Add a function to sort contacts alphabetically by name.
3. Search by multiple fields:
   - e.g., find a contact by phone number or email.
*/

function findContact(name) {
  console.log('------------------');
  console.log(`Finding a contact with name ${name}...`);

  let count = 0;

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) {
      console.log(
        `Name: ${contacts[i].name}, Phone: ${contacts[i].phone}, Email: ${contacts[i].email}`,
      );
      count++;
    }
  }

  if (count === 0) {
    console.log(`No contact found with the name: ${name}`);
  }

  console.log('------------------');
}

findContact('jo');
findContact('doe');


function searchContact(name, email, phone) {
  console.log('------------------');
  let searchObject = {};
  if (name) searchObject.name = name;
  if (phone) searchObject.phone = phone;
  if (email) searchObject.email = email;

  const searchBy = Object.keys(searchObject);
  console.log('searchBy', searchBy);
  
  console.log(`Searching a contact by ${searchBy.join(' and ')}...`);

  let count = 0;

  for (let i = 0; i < contacts.length; i++) {
    // Try using for in loop here to loop through searchObject
    
  }


  if (count === 0) {
    console.log(`No contact found by ${searchBy.join(' and ')} where ${Object.values(searchObject).join(' and ')}`);
  }

  console.log('------------------');
}


searchContact('John');
searchContact('John', '123 456 12 34');
searchContact('John', undefined, 'john@gmail.com');
searchContact(undefined, '123 456 12 34', 'john@gmail.com');