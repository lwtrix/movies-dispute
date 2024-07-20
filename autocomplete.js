const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchOptions
}) => {
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content" id="results"></div>
    </div>
  </div>   
`;

  const results = root.querySelector('#results');
  const dropdown = root.querySelector('.dropdown');
  const input = root.querySelector('.autocomplete input');

  const onInput = async (event) => {
    const items = await fetchOptions(event.target.value);
    results.innerHTML = '';

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    dropdown.classList.add('is-active');
    for (let item of items) {
      const option = document.createElement('a');

      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);

      option.addEventListener('click', () => {
        input.value = inputValue(item);
        dropdown.classList.remove('is-active');
        onOptionSelect(item);
      });

      results.appendChild(option);
    }
  };

  input.addEventListener('input', debounce(onInput));

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};
