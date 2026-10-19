# Shared graphic conventions

- Keep config like the Flourish sidebar: graph appearance, interactive controls, and bindings to source columns. Keep source like the Data tab: actual values, display names, section membership, and group order.
- Prepare, simplify, or restrict source data to fit the graph. Change grouping in the source. Do not add config fields or parsing rules to rename, clean, or regroup data when editing the source is simpler.
- Import public config JSON files for schema defaults. Use createShellConfigSchema with the same config for Shell defaults; do not repeat sample values in the schema.
- Derive group order from the first occurrence in the source. Keep filters that affect candidate cards separate from the donations used in the bar.
- Shared and project packages can each have several components. Register component entries and schemas in their own component registry.
- Reuse Shell for layout, typography, and loading, error, and empty states. Use createGraphic for fetching, validation, and CMS synchronization.
- Use colorSchema for editable hex colors. Its ui:widget metadata selects the CMS color picker. Keep project theme colors in the project.
- Keep Storybook parameters and URL mappings in the shared preview. Projects and templates re-export it. Include shared EmbedCode in stories so CMS iframe previews also show copy controls.
