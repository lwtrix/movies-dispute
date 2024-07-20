const fetchMovieData = async (imdbId) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: '37697e59',
      i: imdbId,
    },
  });

  return response.data;
};

const onMovieSelect = async (movie) => {
  const data = await fetchMovieData(movie.imdbID);
  document.querySelector('#selected').innerHTML = movieTemplate(data);
};

createAutoComplete({
  root: document.querySelector('#autocomplete'),
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <div class="placeholder ${imgSrc === '' ? 'show' : ''}"></div>
      <img src="${imgSrc}"/>
      <span>${movie.Title} (${movie.Year})</span>
    `;
  },
  onOptionSelect: (movie) => {
    onMovieSelect(movie);
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
});

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
