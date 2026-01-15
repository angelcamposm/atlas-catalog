.PHONY: build\:dev

build\:dev: create clean
	kustomize build overlays/development --output config/development/

build\:pro: create clean
	kustomize build overlays/production --output config/production/

clean:
	@find ./config/development -type f  -name "*.yaml" -exec rm -f {} +
	@find ./config/production -type f  -name "*.yaml" -exec rm -f {} +

create:
	@echo Clean config directory
	@mkdir -p config/{development,production} || true