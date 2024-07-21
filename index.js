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
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
  ...autoCompleteConfig,
});

createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
  ...autoCompleteConfig,
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: '37697e59',
      i: movie.imdbID,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftStatsElements = document.querySelectorAll('#left-summary .stat');
  const rightStatsElements = document.querySelectorAll('#right-summary .stat');
  let leftStatsCount = 0;
  let rightStatsCount = 0;

  leftStatsElements.forEach((leftStat, idx) => {
    const rightStat = rightStatsElements[idx];

    const leftStatValue = parseFloat(leftStat.dataset.value);
    const rightStatValue = parseFloat(rightStat.dataset.value);

    if (leftStatValue > rightStatValue) {
      leftStatsCount++;

      leftStat.classList.add('is-danger');
      rightStat.classList.remove('is-danger');

      leftStat.classList.remove('is-primary');
      rightStat.classList.remove('is-primary');
    } else {
      rightStatsCount++;

      rightStat.classList.add('is-danger');
      leftStat.classList.remove('is-danger');

      leftStat.classList.remove('is-primary');
      rightStat.classList.remove('is-primary');
    }

    if (leftStatValue === rightStatValue) {
      leftStat.classList.add('is-primary');
      rightStat.classList.add('is-primary');

      leftStat.classList.remove('is-danger');
      rightStat.classList.remove('is-danger');
    }

    renderWinner(leftStatsCount, rightStatsCount);
  });
};

const renderWinner = (leftStatsCount, rightStatsCount) => {
  const winnerElement = document.querySelector('.winner');
  winnerElement.classList.remove('is-hidden')
  if (leftStatsCount > rightStatsCount) {
    winnerElement.innerHTML = `
        <h2 class="title">Winner: <strong>${leftMovie.Title}</strong></h2>
        <p class="subtitle is-size-3 has-text-weight-bold"><span class="has-text-danger">${leftStatsCount}</span> : ${rightStatsCount}</p>
    `;
  } else {
    winnerElement.innerHTML = `
        <h2 class="title">Winner: <strong>${rightMovie.Title}</strong></h2>
        <p class="subtitle is-size-3 has-text-weight-bold">${leftStatsCount} : <span class="has-text-danger">${rightStatsCount}</span></p>
    `;
  }
};

const movieTemplate = (movieDetails) => {
  const boxOffice = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

  const awards = movieDetails.Awards.split(' ').reduce((total, item) => {
    if (!isNaN(parseInt(item))) {
      return total + parseInt(item);
    }
    return total;
  }, 0);

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
    <article data-value=${awards} class="notification stat">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxOffice} class="notification stat">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification stat">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification stat">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification stat">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
