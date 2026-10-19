![output](https://github.com/user-attachments/assets/5c73d695-a34d-4eb6-8c2f-a9f539da8803)

## Create a project

From `packages/twreporter/ddd`:

```sh
pnpm install
pnpm create-project
```

Enter the project slug and first component slug when prompted. You can also pass both names:

```sh
pnpm create-project 2026-10-population chart
cd 2026-10-population
pnpm install
pnpm dev
```

Storybook is the development server. Projects remain in the parent workspace and can contain multiple components. Each registered component gets its own script and JSON Schema.

See the generated project's README for development and deployment commands.
