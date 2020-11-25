const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        //changes the status of the promise from pending to fulfilled
        resolve(data);
      } else {
        //if status isn't 200 call reject
        //Error will display stack traits and status text for a more meaningful error
        reject(Error(xhr.statusText))
      }
    };
    //incase of connectivity error reject promise
    xhr.onerror = () => reject(Error('A network error occured'));
    xhr.send();
  });
}

function getProfiles(json) {
  const profiles = json.people.map(person => {
    return getJSON(wikiUrl + person.name);
  });
  return profiles;
}

function generateHTML(data) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>${data.extract}</p>
  `;
}

btn.addEventListener('click', (event) => {
  getJSON(astrosUrl)
    .then(getProfiles)
    .then(data => console.log(data))
    .catch(err => console.log(err))

  event.target.remove();
});