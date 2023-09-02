export function extractQueryParams(query) {
  const formatQueryParams = (queryParams, param) => {
    const [key, value] = param.split("=");
    queryParams[key] = value;

    return queryParams;
  }

  return query.substr(1).split("&").reduce(formatQueryParams, {});
}