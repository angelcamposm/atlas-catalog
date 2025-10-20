REGISTRY :=
ORGANIZATION :=
REPOSITORY := atlas-catalog
TAG := v0.1.0

FULL_IMAGE_NAME := $(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)

.PHONY: build
build:
	docker build --tag $(FULL_IMAGE_NAME) -f Dockerfile .
