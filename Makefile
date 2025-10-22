REGISTRY :=
ORGANIZATION :=
REPOSITORY := atlas-catalog
TAG := latest

FULL_IMAGE_NAME := $(REPOSITORY):$(TAG)

.PHONY: build
build:
	docker build --tag $(FULL_IMAGE_NAME) -f Dockerfile .
