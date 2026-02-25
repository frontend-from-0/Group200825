// 1. Convert the function below into asyncrounous function using async/await and try/catch syntax.
// function fetchPosts() {
//   fetch('https://jsonplaceholder.typicode.com/posts')
//     .then((response) => response.json())
//     .then((posts) => console.log(posts))
//     .catch((error) => console.error(error));
// }

async function fetchPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// 2. Convert the function below into asyncrounous function using async/await and try/catch syntax.
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched successfully!');
    }, 2000);
  });
};

/*fetchData()
	.then((result) => console.log(result))
	.catch((error) => console.error(error));*/

// IIFE
(async function () {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();

// 3. Convert the function below into asyncrounous function using async/await and try/catch syntax.
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();
  console.log(users);
  return users;
};

/*fetchUsers()
  .then((users) => console.log('Total users:', users.length))
  .catch((error) => console.error(error));*/

(async function () {
  try {
    const users = await fetchUsers();
    console.log('Total users:', users.length);
  } catch (error) {
    console.error(error);
  }
})();

// 4. Convert the function below into asyncrounous function using async/await and try/catch syntax.
const fetchUserData = async () => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
    );
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// fetchUserData()
//   .then((user) => console.log('User data:', user))
//   .catch((error) => console.error('Error:', error));

(async function () {
  try {
    const user = await fetchUserData();
    console.log('User data:', user);
  } catch (error) {
    console.log('Error:', error);
  }
})();

// 5. Convert the function below into asyncrounous function using async/await and try/catch syntax.
// const getPostsAndComments = () => {
//   fetch('https://jsonplaceholder.typicode.com/posts/1')
//     .then((response) => response.json())
//     .then((post) => {
//       return fetch(
//         `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`,
//       );
//     })
//     .then((response) => response.json())
//     .then((comments) => console.log(comments))
//     .catch((error) => console.error(error));
// };

const getPostsAndComments = async () => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
    );
    const post = await response.json();

    const commentsResponse = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`,
    );

    const comments = await commentsResponse.json();
    console.log(comments);
  } catch (error) {
    console.error(error);
  }
};

// 6.Convert the function below into asyncrounous function using async/await and try/catch syntax.

const fetchWithTimeout = (url, timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw Error('Some API request error....');

        resolve(await response.json());
      } catch (error) {
        reject(error);
      }
    }, timeout);
  });
};

// fetchWithTimeout('https://jsonplaceholder.typicode.com/posts', 2000)
//   .then((posts) => console.log(posts))
//   .catch((error) => console.error(error));

(async function getPosts() {
  try {
    const posts = await fetchWithTimeout(
      'https://jsonplaceholder.typicode.com/posts',
      2000,
    );
    console.log(posts);
    posts.forEach(post => {
      const div = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = post.body;
      div.appendChild(p);
    });
  } catch (error) {
    console.error(error);
    document.getElementById('errorMessage').textContent = 'An error occured when fetching posts, try again later.';
  }
})();


document.getElementById('getPostsButton').addEventListener('click', getPosts);