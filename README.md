# Article Management Dashboard

This project is a simple dashboard for managing bicycle component articles, built with Angular and .NET 6.

## Technology Choices

* **Frontend**: Angular 11, Angular Material
* **Backend**: .NET 6 Web API
* **Database**: SQLite with Entity Framework Core
* **API Documentation**: Swagger

## Prerequisites

* .NET 6 SDK
* Node.js (v14+) and NPM
* Angular CLI (v11+)

## How to Run

1.  **Run the Backend**
    * Navigate to the `backend` directory.
    * Run `dotnet restore` if needed.
    * Run `dotnet ef database update` to create the database.
    * Run `dotnet run`. The API will be available at `http://localhost:5193`.

2.  **Run the Frontend**
    * Navigate to the `frontend` directory.
    * Run `npm install`.
    * Run `ng serve`. The app will be available at `http://localhost:4200`.