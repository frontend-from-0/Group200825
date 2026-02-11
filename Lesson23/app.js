
fetch('https://jsonplaceholder.typicode.com/users/1/posts')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed fetching post by id. Status: ${response.status}, Status text: ${response.statusText}`);
    }
    console.log(response);
    return response.json();
  })
  .then((json) => console.log(json))
  .catch(error => console.log('Error fetching posts by id!', error));