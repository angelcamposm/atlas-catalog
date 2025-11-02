# ADR-004: Redis for Caching

**Status**: Accepted

**Date**: 2023-10-27

## Context

The Atlas Catalog API needs a high-performance caching solution to improve response times, reduce the load on the primary PostgreSQL database, and handle transient application data such as sessions and queues. The chosen solution must be fast, scalable, and integrate seamlessly with the Laravel framework.

## Decision

We have chosen to use **Redis** as the primary caching driver, session store, and queue driver for the application.

## Justification

Redis is an advanced, in-memory key-value store known for its performance, flexibility, and rich feature set. The decision is based on the following factors:

1.  **Performance**: As an in-memory data store, Redis provides extremely low-latency read and write operations. This is essential for a high-throughput API where quick data access is critical for a good user experience.
2.  **Versatility**: Redis is more than just a simple cache. It can be used for multiple purposes within our stack:
    *   **Application Cache**: Caching database query results, configuration, and rendered responses.
    *   **Session Handling**: Storing user session data for a fast and scalable session management solution.
    *   **Queue Driver**: Managing background jobs and queues, which is a core feature of Laravel.
    This versatility simplifies our technology stack by using a single tool for multiple related concerns.
3.  **Rich Data Structures**: Unlike traditional key-value stores like Memcached, Redis supports a variety of data structures (e.g., Hashes, Lists, Sets, Sorted Sets). This allows for more sophisticated caching patterns and application logic without adding complexity.
4.  **Excellent Laravel Integration**: Laravel provides native, first-class support for Redis. The configuration is straightforward, and the framework's caching, session, and queue APIs are designed to work with Redis out of the box.
5.  **Scalability and High Availability**: Redis supports a primary-replica architecture and Redis Sentinel for high availability, as well as Redis Cluster for automatic sharding and horizontal scaling. This provides a clear path for scaling our caching layer as the application grows.

## Consequences

### Positive

*   **Drastically Reduced Latency**: Application performance will be significantly improved by serving frequently accessed data directly from memory.
*   **Reduced Database Load**: Caching will offload a significant number of read queries from the PostgreSQL database, improving its performance and longevity.
*   **Unified Infrastructure Component**: We can use a single Redis instance (or cluster) for caching, sessions, and queues, simplifying our deployment and maintenance overhead.
*   **Improved User Experience**: Faster API response times will lead to a more responsive application.

### Negative

*   **Increased Infrastructure Complexity**: It introduces another service into our stack that requires setup, monitoring, and maintenance.
*   **Memory Management**: Since Redis is an in-memory store, careful capacity planning and memory monitoring are required to ensure it has sufficient resources.
*   **Cache Invalidation Complexity**: As with any caching strategy, we must implement careful cache invalidation logic to prevent stale data from being served.

## Alternatives Considered

*   **Memcached**: A popular, high-performance, in-memory key-value store. While very fast, it is less feature-rich than Redis. It lacks the advanced data structures, persistence options, and built-in pub/sub capabilities that make Redis a more versatile tool for our needs.
*   **Database Cache (PostgreSQL)**: Using a table within our primary database for caching. This option was rejected as it is significantly slower than in-memory solutions and would increase, not decrease, the load on our database.
*   **File/APC Cache**: Laravel's file-based cache is simple but not performant enough for a production API. It also does not work in a multi-server, load-balanced environment. APCu is an in-memory PHP cache but is local to a single server and not suitable for a distributed system.
