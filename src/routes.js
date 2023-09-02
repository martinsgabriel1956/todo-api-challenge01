import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from './utils/buildRoutePath.js';

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { title, description } = request.query;

      const tasks = database.read("tasks", {
        title,
        description,
      });
      const formattedTasks = JSON.stringify(tasks);
      return response.writeHead(200).end(formattedTasks)
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title is required' }),
        )
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'description is required' })
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        ["completed_at"]: null,
        ["created_at"]: new Date(),
        ["updated_at"]: new Date(),
      }

      database.create("tasks", task);

      return response.writeHead(201).end()
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { title, description } = request.body;
      const { id } = request.params;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title or description are required' })
        )
      }

      database.update("tasks", id, { title, description });

      return response.writeHead(201).end()
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      database.delete("tasks", id);
      return response.writeHead(201).end()
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;

      database.updateStatus("tasks", id);

      return response.writeHead(201).end()
    },
  },
];
