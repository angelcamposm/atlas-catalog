# ADR-006: Meilisearch for Search and Indexing

**Status**: Accepted

**Date**: 2023-10-27

## Context

The Atlas Catalog requires a powerful, fast, and user-friendly search capability to allow users to easily find services and other resources. The search experience is a critical feature of the application. The ideal solution should provide instant, relevant results, be tolerant of typos, and integrate smoothly with our Laravel backend. Relying on traditional database queries (e.g., `LIKE` statements) is not sufficient for providing a modern search experience.

## Decision

We have chosen to use **Meilisearch** as the dedicated search and indexing engine for the Atlas Catalog.

## Justification

Meilisearch is a high-performance, open-source search engine designed for speed and ease of use. The decision is based on the following factors:

1.  **Exceptional Performance**: Meilisearch is written in Rust and is optimized for providing near-instant search results (typically under 50ms). This is crucial for building a responsive, real-time search experience.
2.  **Superior User Experience Features**: It comes with a rich set of features out-of-the-box that are essential for a modern search UI, including:
    *   **Typo Tolerance**: Users get relevant results even if they make spelling mistakes.
    *   **Prefix Search**: Provides instant results as the user types.
    *   **Advanced Filtering and Faceting**: Allows users to easily refine search results.
    *   **Customizable Relevance**: We can fine-tune the ranking of search results to match our business logic.
3.  **Seamless Laravel Integration**: Meilisearch has an official driver for Laravel Scout. This allows us to easily index our Eloquent models and keep them synchronized with the search engine, dramatically simplifying the development workflow.
4.  **Developer Experience**: Meilisearch is known for its simplicity and ease of use. It is schema-less, meaning we don't have to define our data structure upfront, and its API is intuitive and well-documented.
5.  **Simple Deployment and Maintenance**: It is distributed as a single, lightweight binary with no external dependencies. This makes it incredibly easy to deploy, manage, and scale compared to more complex alternatives like Elasticsearch.

## Consequences

### Positive

*   **Fast and Relevant Search**: Users will have a best-in-class search experience.
*   **Simplified Development**: Integration with Laravel Scout abstracts away the complexity of indexing and searching data.
*   **Reduced Database Load**: Complex search queries are offloaded from our primary PostgreSQL database to a dedicated, optimized service.
*   **Scalable Architecture**: Meilisearch can be scaled independently of the main application and database.

### Negative

*   **Additional Infrastructure**: It introduces another service to our stack that requires deployment, monitoring, and maintenance.
*   **Data Synchronization**: We must ensure that data between our primary database (PostgreSQL) and Meilisearch stays synchronized. While Laravel Scout handles most of this, care must be taken to handle potential inconsistencies.
*   **Memory Usage**: As a high-performance engine, Meilisearch can be memory-intensive, which needs to be considered during capacity planning.

## Alternatives Considered

*   **Algolia**: A popular, hosted search-as-a-service platform. It offers excellent performance and a great user experience. However, it is a proprietary, third-party service, which can lead to significant costs and vendor lock-in. Meilisearch provides a comparable experience in a self-hostable, open-source package.
*   **Database Full-Text Search (PostgreSQL)**: Using the built-in full-text search capabilities of PostgreSQL. While this avoids adding another service, it is significantly less performant and lacks the advanced features (like typo tolerance and optimized prefix search) that Meilisearch provides out of the box.
*   **Elasticsearch / OpenSearch**: These are extremely powerful and feature-rich search engines. However, they are also notoriously complex to set up, manage, and scale. For our current needs, their complexity and resource overhead are not justified.
*   **Typesense**: Another excellent open-source search engine focused on performance and ease of use, similar to Meilisearch. It is a very strong competitor. Meilisearch was chosen due to its slightly more mature ecosystem and official Laravel Scout driver at the time of this decision, which aligns with our goal of a streamlined developer experience.
