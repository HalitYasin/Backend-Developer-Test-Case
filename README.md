# Backend Developer Test Case App

This project is a backend application built using Express.js and SQLite3. It provides basic CRUD (Create, Read, Update, Delete) operations and utilizes Swagger for API documentation.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [API Documentation](#api-documentation)
- [Endpoints](#endpoints)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager) should be installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HalitYasin/Backend-Developer-Test-Case.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Backend-Developer-Test-Case
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

### Running the Server

1. Create a `.env` file in the root directory of the project with the following content:

   ```
   DATABASE_URL=./db/tasks.sqlite
   PORT=3005
   ```

2. Start the server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3005`.

### API Documentation

API documentation is provided using Swagger UI. You can access the API documentation by visiting:

```
http://localhost:3005/api-docs
```

Swagger UI will show you the available endpoints, request parameters, request bodies, and response schemas.

## Environment Variables

To run this project, you need to set up the following environment variables in a `.env` file in the root folder of the project:

- `DATABASE_URL`: The URL or path to your SQLite database file.
- `PORT`: The port on which the server will run.

## Endpoints

- **GET /tasks**: Get a list of all tasks.
- **GET /tasks/:id**: Get details of a specific task by ID.
- **POST /tasks**: Create a new task.
- **PATCH /tasks/:id**: Update details of a specific task by ID.
- **DELETE /tasks/:id**: Delete a specific task by ID.


## License

This project is licensed under the MIT License - see the [WIKI](https://en.wikipedia.org/wiki/MIT_License) for details.