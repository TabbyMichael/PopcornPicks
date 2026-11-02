# Helm Charts

Helm charts for package management and templating of PopcornPicks deployments.

## Chart Structure
- Chart.yaml: Chart metadata
- values.yaml: Default configuration values
- values-dev.yaml: Development overrides
- values-prod.yaml: Production overrides
- templates/: Kubernetes templates
- NOTES.txt: Installation notes

## Usage
```bash
helm install popcornpicks ./helm
helm upgrade popcornpicks ./helm
helm uninstall popcornpicks
```

## Status
Placeholder - Not yet implemented
