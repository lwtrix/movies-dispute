const autoCompleteConfig = {
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <div class="placeholder ${imgSrc === '' ? 'show' : ''}"></div>
      <img src="${imgSrc}"/>
      <span>${movie.Title} (${movie.Year})</span>
    `;
  },
  inputValue: (movie) => {
    return movie.Title;
  },
  fetchOptions: async (searchValue) => {
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
  },
};

createAutoComplete({
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'));
  },
  ...autoCompleteConfig,
});

createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'));
  },
  ...autoCompleteConfig,
});

const fetchMovieData = async (imdbId) => {
  return response.data;
};

const onMovieSelect = async (movie, summaryElement) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: '37697e59',
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);
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
  `;
};
