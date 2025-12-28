# E-lib: A Digital Library System

## System Overview

E-lib is a multi-repository, full-stack application designed to function as a digital library. The system is composed of three distinct but interconnected components: a backend API, a public-facing frontend for browsing, and a private dashboard for content management. These components are designed to work together and are not intended for standalone use.

## System Architecture

The system operates with a classic client-server architecture. The Backend serves as the central API and data authority, while the Frontend and Dashboard act as clients.

- **Backend (`E-lib-Backend`)**

  - **Purpose**: Acts as the central nervous system for the E-lib application. It handles all business logic, data persistence, file storage, and authentication.
  - **Functionality**: Exposes a RESTful API for book and user management (CRUD operations). Manages user authentication (JWT) and authorization. Interfaces with a database (e.g., MongoDB) and a cloud storage provider (e.g., Cloudinary) for book files and cover images.

- **Public Frontend (`E-lib-Frontend`)**

  - **Purpose**: Provides a read-only, public-facing interface for users to browse and download books. This is the repository where this README is located.
  - **Functionality**: Consumes the Backend API to display a list of books and their details. Implements a server-side caching layer with webhook-based invalidation to ensure data freshness while minimizing API calls. No authentication is required for access.

- **Authenticated Dashboard (`E-lib-Dashboard`)**
  - **Purpose**: A private, authenticated web application for registered users to manage their books.
  - **Functionality**: Allows users to perform create, read, update, and delete (CRUD) operations on books they own. It communicates with the same Backend API, sending authenticated requests using JWTs obtained during login.

## Technology Stack

The system utilizes different technologies for each component, chosen to fit their specific roles.

- **Backend (`E-lib-Backend`)**

  - **Runtime**: Node.js
  - **Framework**: Express.js
  - **Language**: TypeScript
  - **Database**: MongoDB (inferred)
  - **File Storage**: Cloudinary (inferred)

- **Public Frontend (`E-lib-Frontend`)**

  - **Framework**: Next.js, React
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS
  - **Tooling**: Turbopack, ESLint

- **Authenticated Dashboard (`E-lib-Dashboard`)**
  - **Framework**: React, Vite
  - **Language**: TypeScript (inferred)
  - **Styling**: (Not specified, likely a standard CSS solution like Tailwind CSS or Material-UI)

## Local Development Setup

To run the entire system locally, each of the three components must be installed and running concurrently.

- **Prerequisites**

  - Node.js
  - npm (or a compatible package manager)
  - Access to all three repositories (`E-lib-Backend`, `E-lib-Frontend`, `E-lib-Dashboard`).
  - A configured MongoDB instance and Cloudinary account for the backend.

- **Installation & Running**
  1.  **Backend**:
      - Navigate to the `E-lib-Backend` directory.
      - Create and configure its `.env` file with database connection strings, JWT secrets, and Cloudinary keys.
      - Run `npm install` to install dependencies.
      - Run `npm run dev` (or equivalent) to start the server.
  2.  **Frontend (This Repository)**:
      - Navigate to the `E-lib-Frontend` directory.
      - Create a `.env` file from `.env sample` and set `BACKEND_URL` to the running backend's address (e.g., `http://localhost:8000`).
      - Run `npm install`.
      - Run `npm run dev` to start the Next.js application.
  3.  **Dashboard**:
      - Navigate to the `E-lib-Dashboard` directory.
      - Create its `.env` file and set the variable for the backend API URL.
      - Run `npm install`.
      - Run `npm run dev` to start the Vite development server.

## Repository Structure (E-lib-Frontend)

This section details the structure of the `E-lib-Frontend` repository only.

```
.
├── src/
│   ├── app/             # Next.js App Router pages and API routes
│   │   ├── api/         # API routes for cache management
│   │   └── book/        # Dynamic routes for individual books
│   ├── components/      # Shared React components
│   └── utils/           # Caching logic
├── .env sample          # Example environment variables
├── next.config.ts       # Next.js configuration
└── package.json         # Dependencies and scripts
```

## System-Wide Limitations

- The components are tightly coupled and are not designed to be operated independently.
- The entire system must be deployed and configured correctly for any single part to function.
- No automated tests are present in the frontend repository, and test coverage for other components is unknown.
- Security for features like webhooks is basic and may require enhancement for production environments.

## Contributing

To contribute, submit a pull request with a clear description of changes. Ensure code follows the existing style conventions and passes linting checks for the respective repository.

## License

No license is specified in this repository.
