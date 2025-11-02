# Apicurio Registry for Atlas Catalog API

This directory contains the Docker Compose setup for running Apicurio Registry, which will be used as the design and management tool for the OpenAPI Specification (OAS) of the Atlas Catalog REST API.

## Overview

Apicurio Registry is an open-source tool that provides a datastore for API descriptions and other schemas. We are using it to:

*   **Design and Author** the OpenAPI (v3) specification for our API.
*   **Store and Manage** versions of the API specification.
*   **Collaborate** on the API design in a structured way.
*   **Generate Documentation** and validate API conformance.

## Getting Started

This setup uses Docker Compose to run the Apicurio UI, the backend registry, and a PostgreSQL database for persistence.

### Prerequisites

*   Docker
*   Docker Compose

### How to Run

1.  **Navigate to this directory**:

    ```sh
    cd build/apicurio
    ```

2.  **Start the services** using Docker Compose:

    ```sh
    docker-compose up -d
    ```

    This command will pull the required Docker images and start the three services in the background:

    *   `apicurio-registry-frontend`: The web interface.
    *   `apicurio-registry-backend`: The core registry API.
    *   `apicurio-postgres`: The PostgreSQL database.

3.  **Access the Apicurio UI**:

    Once the services are running, you can access the Apicurio web interface in your browser at:

    [**http://localhost:8888**](http://localhost:8888)

## Service Configuration

The `docker-compose.yml` file defines the following services:

*   **`frontend` (Apicurio UI)**:
    *   **Host Port**: `8888`
    *   **Container Port**: `8080`
    *   Connects to the `backend` service at `http://backend:8080`.

*   **`backend` (Apicurio Registry API)**:
    *   **Host Port**: `8085`
    *   **Container Port**: `8080`
    *   Stores its data in the `postgres` service.

*   **`postgres` (PostgreSQL Database)**:
    *   **Host Port**: `5433`
    *   **Container Port**: `5432`
    *   Persists data in a local Docker volume named `postgres-data`.

## How to Use for API Design

1.  Open the Apicurio UI at [http://localhost:8888](http://localhost:8888).
2.  You can start creating a new API by clicking the "Add API" button.
3.  When creating the API, select **OpenAPI 3.x** as the type.
4.  Use the visual editor to define the paths, operations, components, and schemas for the Atlas Catalog API.
5.  The API design will be automatically saved and versioned within the registry.

## Stopping the Services

To stop the Apicurio services, run the following command from this directory:

```sh
docker-compose down
```

To remove the persistent data (the PostgreSQL volume), run:

```sh
docker-compose down -v
```
