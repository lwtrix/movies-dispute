const fetchMovies = async (searchValue) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: '37697e59',
      s: searchValue,
    },
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const fetchMovieData = async (imdbId) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: '37697e59',
      i: imdbId,
    },
  });

  return response.data;
};

const autocompleteRoot = document.querySelector('#autocomplete');
autocompleteRoot.innerHTML = `
  <label><b>Search for a movie</b></label>
  <input class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content" id="results"></div>
    </div>
  </div>   
`;

const results = document.querySelector('#results');
const dropdown = document.querySelector('.dropdown');
const input = document.querySelector('.autocomplete input');

const onInput = async (event) => {
  const data = await fetchMovies(event.target.value);
  results.innerHTML = '';

  if (!data.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  for (let movie of data) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    const movieItem = document.createElement('a');

    movieItem.classList.add('dropdown-item');
    movieItem.innerHTML = `
      <div class="placeholder ${imgSrc === '' ? 'show' : ''}"></div>
      <img src="${imgSrc}"/>
      ${movie.Title}
    `;

    movieItem.addEventListener('click', (event) => {
      onMovieSelect(movie)
    });

    results.appendChild(movieItem);
  }
  dropdown.classList.add('is-active');
};

input.addEventListener('input', debounce(onInput));

const onMovieSelect = async (movie) => {
  input.value = movie.Title;
  dropdown.classList.remove('is-active');
  
  const data = await fetchMovieData(movie.imdbID);
  document.querySelector('#selected').innerHTML = movieTemplate(data)
};

const movieTemplate = (movieDetails) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}

document.addEventListener('click', (e) => {
  if (!autocompleteRoot.contains(e.target)) {
    dropdown.classList.remove('is-active');
  }
});
