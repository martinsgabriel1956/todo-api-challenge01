import http from "node:http";
import { routes } from './routes.js';
import { JSONMiddleware } from "./middleware/json.js";
import { extractQueryParams } from './utils/extractQueryParams.js';

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await JSONMiddleware(request, response);

  const route = routes.find(route => route.method === method && route.path.test(url));

  if(route) {
    const routeParams = request.url.match(route.path);
    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    return route.handler(request, response);
  }

  response.writeHead(404).end;
});

server.listen(3333);
