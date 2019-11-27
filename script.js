const locationInput = document.querySelector('.location');
const positionInput = document.querySelector('.position');
const searchBtn = document.querySelector('.search'); 
const ul = document.querySelector('.jobs')
const observer = document.querySelector(".observer");

let jobState = {
    job: [],
    counter: 1,
    index: 0
};

const getFetch = page => {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = `https://jobs.github.com/positions.json?title=${positionInput.value}&location=${locationInput.value}&page=${page}`;
   return fetch(proxyUrl + targetUrl)
    .then(response => 
      response.json()
    )
    .then(job => {
      ul.style.height = 500 + 'px';
      ul.style.overflowY = 'scroll';
      job.forEach((element, index) => (element.index = index));
      jobState.job = jobState.job.concat(job);
      job;
    });
}


const createBlock  = (type, company, url, location, title) => {
  const li = document.createElement('li');
  ul.append(li);

  const span = document.createElement('span');
  span.setAttribute('class', 'type-and-company');
  span.textContent = `${company} - ${type}`;

  const p = document.createElement('p');
  p.setAttribute('class', 'location');
  p.textContent = `${location}`;

  const h2 = document.createElement('h2');
  h2.setAttribute('class', 'title');
  h2.textContent = `${title}`;

  
  const a = document.createElement('a')
  a.setAttribute('class', 'link');
  a.href = `${url}`;
  a.textContent = 'See more';
  
  li.append(span);
  li.append(p);
  li.append(h2);
  li.append(a);
}

const setList = data => {
  data.forEach(elem => {
    createBlock(
        elem.type,
        elem.company,
        elem.url,
        elem.location,
        elem.title
    );
  });
}

const createNextCards = number => {
  const newCards = jobState.job.slice (
    jobState.index,
    jobState.index + number
  );
  jobState.index += number;
  setList(newCards);
  if(jobState.index >= jobState.job.length - number) {
    getNewPage();
  }
}

const getNewPage = () => {
  jobState.counter++;
  getFetch(jobState.counter);
}

const newFetch = () => {
  getFetch(1)
  .then(() => {
    createNextCards(3);
    const intersection = new IntersectionObserver(note => {
      if (note[0].coeff <= 0) {
        return;
      }
      ul.appendChild(observer);
      createNextCards(1);
    });
    intersection.observe(observer);
  });
};
newFetch();

searchBtn.addEventListener("click", () => newFetch());










