# Infrastructure as Code (IaC) for Atlas Catalog

This directory contains all the Kubernetes resources needed to deploy the Atlas Catalog application and its dependencies (PostgreSQL, Redis). The configuration is managed using **Kustomize**, which allows for a declarative and environment-agnostic approach to managing Kubernetes manifests.

## Prerequisites

Before deploying, ensure you have the following tools installed and configured:

1.  **`kubectl`**: The Kubernetes command-line tool.
2.  **`kustomize`**: A tool for customizing Kubernetes configurations. It is bundled with `kubectl` starting from v1.14.
3.  **A Kubernetes Cluster**: You must have access to a running Kubernetes cluster and have your `kubectl` context configured to point to it.

## Directory Structure

To modify the configuration for a specific environment, edit the `kustomization.yaml` and patch files within that environment's overlay directory. For example, to change the number of replicas for the backend in production, you would modify the patch file in `iac/overlays/production/`.

```
iac/
├── base/
│   ├── resources
│   │   └── namespace.yaml
│   └── kustomization.yaml
├── config/
│   ├── development/
│   └── production/
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml
│   │   └── ... (patches for dev)
│   └── prod/
│       ├── kustomization.yaml
│       └── ... (patches for prod)
└── projects/
    ├── app/
    │   ├── resources
    │   │   ├── deployment.yaml
    │   │   └── service.yaml
    │   ├── kustomization.yaml
    │   └── ... (patches for dev)
    ├── postgresql/
    │   ├── resources
    │   │   ├── deployment.yaml
    │   │   └── service.yaml
    │   ├── kustomization.yaml
    │   └── ... (patches for dev)
    ├── ... (other projects)
    └── ... (other projects)
```

## Deployment Instructions

To deploy the application, you will apply the configuration from one of the `overlays`.

### Pre-Deployment Steps: Create Secrets

Before the first deployment, you must create the necessary Kubernetes secrets. **These are not stored in Git for security reasons.**

1.  **Atlas Catalog Secret**: Create a secret for the main application's environment variables.

    ```sh
    kubectl create secret generic atlas-catalog-secret \
        --from-env-file=./src/.env
    ```

2.  **PostgreSQL Secret**: Create a secret with your desired database credentials.

    ```sh
    kubectl create secret generic postgres-secret \
        --from-literal=POSTGRES_DB=mydatabase \
        --from-literal=POSTGRES_USER=myuser \
        --from-literal=POSTGRES_PASSWORD=your-secure-password
    ```

3.  **Redis Secret**: Create a secret for the Redis password.

    ```sh
    kubectl create secret generic redis-secret \
        --from-literal=REDIS_PASSWORD=your-secure-password
    ```

### Deploying to an Environment

To deploy, use `kubectl apply -k` and point it to the desired overlay directory.

-   **Deploy to Development**:

    ```sh
    kubectl apply -k iac/overlays/development
    ```

-   **Deploy to Production**:

    ```sh
    kubectl apply -k iac/overlays/production
    ```

> The `-k` flag tells `kubectl` to use Kustomize to build the final manifests by applying the overlay's patches to the `base` resources before deploying them to the cluster.

## Customization

To modify the configuration for a specific environment, edit the `kustomization.yaml` and patch files within that environment's overlay directory. For example, to change the number of replicas for the backend in production, you would modify the patch file in `iac/overlays/production/`.

## Important Notes

- **Secret Management**: The deployments rely on Kubernetes Secrets that must be created in the cluster *before* applying the configurations. These secrets are not stored in Git. Refer to the individual resource files in `/base` for the names of the required secrets (e.g., `postgres-secret`, `redis-secret`).

- **Persistent Volumes**: The stateful components (PostgreSQL and Redis) require Persistent Volumes (PVs) to be available in your cluster. The `StatefulSet` configurations will create `PersistentVolumeClaims` (PVCs) that need to bind to these PVs.