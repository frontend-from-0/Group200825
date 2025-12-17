  /* Programming paradigms
  OOP - Object Oriented programming
  FP - Functional programming

  OOP:  state is usually stored in objects and can be modified through methods 
  FP: state is immutable, and functions are designed to transform data rather than mutate it
  
  OOP: classes encapsulates related data and behavior
  FP: problems are broken down into smaller, composable functions that can be combined to solve larger problems.

*/

// Real life situation: we have multiple users on our website, and we want to store their information in a way that is easy to access and modify. Different users have different roles, and we want to be able to easily change their roles. We also need to make sure that all users have the same properties.

const user1 = {
  username: 'John',
  email: 'john@gmail.com',
  role: 'user'
};

const user2 = {
  username: 'Jane',
  email: 'jane@gmail.com'
}

const user3 = {
  name: 'Adam',
  email: 'adam@gmail.com',
  role: 'admin'
}

class User {
  #username;
  #email;

  constructor(username, email) {
    this.#username = username;
    this.#email = email;
    this.role = 'user';
  }

  describe() {
    console.log(`Current user is: ${this.#username}, email: ${this.#email}. The role is ${this.role}`);
  }

  get username () {
    return this.#username.toUpperCase();
  }

  set username(newUsername) {
    this.#username = newUsername.trim().toLowerCase();
  }


  get email () {
    return this.#email;
  }

  set email (newEmail) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof newEmail !== 'string') {
      console.error('Email should be a string');
      return;
    }
    if (emailPattern.test(newEmail)) {
      this.#email = newEmail;
    } else {
      console.error('Please provide email in the correct format, e.g. name@gmail.com');
      return;
    }
  }
}

class AdminUser extends User {
  constructor(username, email) {
    super(username, email);
    this.role = 'admin';
  }
}



const regularUser1 = new User('johndoe123', 'john@gmail.com');

const adminUser1 = new AdminUser('janedoe21', 'jane@gmail.com');

console.log(regularUser1, adminUser1);

regularUser1.describe();
regularUser1.username ='   JOHNDOE000   ' ;
regularUser1.email = 'not an email';

regularUser1.describe();

adminUser1.describe()



const firstWord = String('first');

const secondWord = String('second');


firstWord.length;
firstWord.toUpperCase();
secondWord.toLowerCase();