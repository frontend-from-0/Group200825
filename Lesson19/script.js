console.log(window);
console.log(document);

const heading = document.getElementById('heading');
heading.style.textAlign = 'center';

const textAccentElements = document.getElementsByClassName('text-accent');
console.log(textAccentElements);

[...textAccentElements].forEach(
  (element) => (element.style.color = 'rgb(255, 0, 0)'),
);

const listItemElements = document.getElementsByTagName('li');
console.log(listItemElements);
// [...listItemElements].forEach(element => element.style.marginBottom = "20px");

[...listItemElements].forEach((element) =>
  element.classList.add('margin-bottom'),
);

const firstListItem = document.querySelector('li:first-of-type');
firstListItem.innerText = 'This is an example sentence.';

const h2Elements = document.querySelectorAll('.text-accent');
h2Elements.forEach((el) => (el.style.fontFamily = 'sans-serif'));

const firstParagraph = document.querySelector("p");
firstParagraph.parentNode.style.backgroundColor = "rgb(227, 223, 223)";

const imgElement = document.querySelector("img");
imgElement.src = './DOM.png';