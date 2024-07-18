const fetchData = async (searchValue) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: '37697e59',
      s: searchValue,
    },
  });
  console.log(response.data.Search)
  return response.data.Search;
};

const onInput = async (event) => {
  const data = await fetchData(event.target.value);
  
  for (let movie of data) {
    const div = document.createElement('div')

    div.innerHTML = `
      <img src="${movie.Poster}"/>
      <p>${movie.Title}</p>
    `

    document.querySelector('.target').appendChild(div);
  }
};

const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput));
