async function fetchData(url, settings) {
  try {
    let response = await fetch(url, settings);
    let data = await response.json();
    return data;
  } catch (err) {
    return null;
  }
}

export { fetchData };
