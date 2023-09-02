import fs from "node:fs";

const databasePath = new URL('../database.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, (error, data) => {
      if(error) this.#persist();

      if(data) {
        this.#database = JSON.parse(data);
      } else {
        this.#persist();
      }
    });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database), (error) => {
      console.log(error);
    });
  }

  create(table, data) {
    const tableExists = Array.isArray(this.#database[table]);

    if(tableExists) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  read(table, search) {
    let data = this.#database[table] ?? [];
    const { title, description } = search;

    if(title) {
      data = data.filter((row) => row.title.toLowerCase().includes(title.toLowerCase()));
    }

    if(description) {
      data = data.filter((row) => row.description.toLowerCase().includes(description.toLowerCase()));
    }

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const registerExists = rowIndex > -1;

    const { title, description } = data;

    if(registerExists) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        title: title ? title : this.#database[table][rowIndex].title,
        description: description ? description : this.#database[table][rowIndex].description,
        ["updated_at"]: new Date(),
      };

      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const registerExists = rowIndex > -1;

    if(registerExists) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
  
  updateStatus(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const registerExists = rowIndex > -1;

    if(registerExists) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        ["completed_at"]: new Date(),
        ["updated_at"]: new Date(),
      }
      this.#persist();
    }
  }
}
