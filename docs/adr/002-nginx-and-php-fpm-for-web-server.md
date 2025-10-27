# ADR-003: Nginx and PHP-FPM for Web Server

**Status**: Accepted

**Date**: 2023-10-27

## Context

The Atlas Catalog API requires a high-performance, scalable, and efficient web server stack to handle incoming HTTP requests. The choice of web server directly impacts the application's ability to serve concurrent users, its resource consumption, and overall responsiveness. The stack must integrate seamlessly with our chosen PHP version and Laravel framework.

## Decision

We have chosen to use **Nginx** as the web server, in combination with **PHP-FPM (FastCGI Process Manager)**, to serve the Laravel application.

## Justification

The Nginx and PHP-FPM combination is a modern, high-performance stack for serving PHP applications. The decision is based on the following factors:

1.  **Performance and Concurrency**: Nginx uses an asynchronous, event-driven architecture, which allows it to handle a high number of concurrent connections with minimal memory usage. This is significantly more efficient than the traditional process-per-request model used by servers like Apache, making it ideal for a scalable API.
2.  **Efficient PHP Handling**: PHP-FPM is an advanced process manager for PHP that works exceptionally well with Nginx. It provides fine-grained control over PHP processes, improving performance and stability, especially under heavy load.
3.  **Scalability**: The low memory footprint and high concurrency support of Nginx make it an excellent choice for scalable deployments. It allows us to serve more traffic with fewer resources, which is cost-effective and efficient.
4.  **Standard for Modern Laravel Deployments**: This stack is a widely adopted industry standard for deploying high-traffic Laravel applications. There is extensive documentation, community support, and tooling available for this specific setup.
5.  **Flexibility as a Reverse Proxy**: Nginx is also a powerful reverse proxy, load balancer, and HTTP cache. This flexibility could be invaluable in the future as our microservices architecture evolves, allowing Nginx to act as an API gateway or ingress controller.

## Consequences

### Positive

*   **High Performance**: The application will be able to handle a large volume of concurrent API requests efficiently.
*   **Lower Resource Consumption**: The chosen stack is memory and CPU efficient, leading to potentially lower infrastructure costs.
*   **Enhanced Scalability**: The architecture is well-suited to horizontal scaling as traffic grows.
*   **Robust and Stable**: The separation of the web server (Nginx) from the PHP process manager (PHP-FPM) provides a stable and resilient environment.

### Negative

*   **Configuration Complexity**: Nginx configuration can be less intuitive for developers accustomed to Apache's `.htaccess` files. All configuration is handled in centralized server block files, which requires server access to modify.

## Alternatives Considered

*   **Apache with `mod_php`**: This is a more traditional setup for PHP applications. While easier to configure for simple use cases (thanks to `.htaccess`), it is generally less performant and consumes more memory under high concurrency. Its process-based model is a known bottleneck for scalability.
*   **LiteSpeed Web Server**: A high-performance Apache alternative that is also event-driven. While it offers excellent performance, Nginx has a larger market share, a bigger community, and is more of a standard in the DevOps and cloud-native ecosystem.
*   **Laravel Octane**: A first-party solution for serving Laravel applications using high-performance application servers like Swoole or RoadRunner. This was considered but deemed an unnecessary complexity for the initial version of the project. The Nginx + PHP-FPM stack provides sufficient performance, and Octane can be adopted later if extreme performance becomes a requirement.
