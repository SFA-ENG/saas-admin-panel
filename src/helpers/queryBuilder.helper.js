const buildQueryParams = (query) => {
  const queryParams = Object.keys(query)
    .filter(
      (key) =>
        query[key] !== null && query[key] !== undefined && query[key] !== ""
    )
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    )
    .join("&");

  return queryParams;
};

export default buildQueryParams;
