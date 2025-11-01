# ADR-002: PostgreSQL for Primary Database

**Status**: Accepted

**Date**: 2023-10-27

## Context

The Atlas Catalog API requires a reliable, scalable, and feature-rich relational database to store and manage its data, which includes services, their attributes, and relationships. The chosen database must be well-supported by the Laravel framework and align with our goals for data integrity, performance, and future scalability.

## Decision

We have chosen **PostgreSQL** as the primary database for all environments (development, testing, and production).

## Justification

PostgreSQL is a powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance. The decision is based on the following factors:

1.  **Advanced Features & Data Integrity**: PostgreSQL offers a more comprehensive set of features compared to other open-source databases, including support for complex queries, a wide variety of data types (including JSONB), and robust transactional integrity. This is crucial for maintaining the quality and consistency of our catalog data.
2.  **Performance and Scalability**: It is known for its excellent performance in complex query scenarios and its ability to scale both vertically and horizontally. This ensures the application can handle future growth in data and traffic.
3.  **Laravel Compatibility**: Laravel provides first-class support for PostgreSQL, making integration seamless. All of Laravel's Eloquent ORM features, migrations, and database tools work flawlessly with it.
4.  **Extensibility**: PostgreSQL is highly extensible. It allows for the creation of custom functions, data types, and operators, which could be valuable as the project's requirements evolve.
5.  **Strong Community and Ecosystem**: It has a vibrant, active community and a rich ecosystem of tools and extensions, ensuring excellent long-term support and viability.
6.  **JSONB Support**: The native JSONB data type is highly efficient for storing and querying semi-structured data. This could be particularly useful for storing flexible metadata about the services in our catalog without needing to alter the schema.

## Consequences

### Positive

*   **High Data Integrity**: PostgreSQL's strict adherence to SQL standards and its robust transactional support will ensure the integrity of our data.
*   **Flexible Data Modeling**: The availability of advanced data types like JSONB and arrays provides greater flexibility in our data modeling.
*   **Future-Proof Scalability**: The choice of PostgreSQL positions us well for future growth and more complex data needs.
*   **Seamless Framework Integration**: No friction is expected when using this database with Laravel's data-access patterns.

### Negative

*   **Hosting Costs**: High-performance PostgreSQL hosting can sometimes be more expensive than for more common databases like MySQL.
*   **Slightly Higher Learning Curve**: For developers only familiar with MySQL, there might be a minor learning curve to understand the nuances of PostgreSQL. This is considered a negligible issue for our experienced team.

## Alternatives Considered

*   **MySQL/MariaDB**: A very popular open-source database and the default for many web applications. While a solid choice, PostgreSQL was favored for its superior feature set, stricter data typing, and better performance on complex analytical queries.
*   **SQLite**: Excellent for local development and testing due to its simplicity and file-based nature. However, it is not suitable for a production environment that requires concurrent write access and robust scalability. It will still be used for development and testing as per our project constraints.
*   **NoSQL Databases (e.g., MongoDB)**: Considered for its flexibility. However, the core data of the Atlas Catalog is highly relational. A relational database provides the data integrity and structured querying capabilities that are better suited for this project's primary needs.
