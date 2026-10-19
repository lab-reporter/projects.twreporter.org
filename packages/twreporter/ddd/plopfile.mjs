import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharedPackage from './shared/package.json' with { type: 'json' }

/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  const sharedVersions = {
    ...sharedPackage.dependencies,
    ...sharedPackage.devDependencies,
  }
  plop.setHelper(
    'sharedVersion',
    (/** @type {keyof typeof sharedVersions} */ name) => sharedVersions[name],
  )

  /** @param {string} projectName */
  const validateProjectName = (projectName) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectName)) {
      return 'Use lowercase letters, digits, and single hyphens between segments.'
    }
    if (existsSync(resolve(plop.getDestBasePath(), projectName))) {
      return `Directory already exists: ${projectName}`
    }
    return true
  }

  plop.setGenerator('project', {
    description: 'Create a DDD Svelte web-component project',
    prompts: [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project slug, for example 2026-10-population',
        validate: validateProjectName,
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'First component slug, for example chart',
        validate: (value) =>
          /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value) ||
          'Start with a lowercase letter and use lowercase letters, digits, and single hyphens.',
      },
    ],
    actions: [
      async (answers) => {
        const result = validateProjectName(
          plop.renderString('{{projectName}}', answers),
        )
        if (result !== true) throw new Error(result)
        if (
          !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(
            plop.renderString('{{componentName}}', answers),
          )
        ) {
          throw new Error('Invalid component slug')
        }
        const workspace = await readFile(
          resolve(plop.getDestBasePath(), 'pnpm-workspace.yaml'),
          'utf8',
        )
        if (!/^packages:\r?$/m.test(workspace)) {
          throw new Error('Expected a packages: entry in pnpm-workspace.yaml')
        }
        return 'Project name is available'
      },
      {
        type: 'addMany',
        destination: '{{projectName}}',
        base: 'template',
        templateFiles: 'template/**/*.hbs',
        globOptions: { dot: true },
      },
      {
        type: 'append',
        path: 'pnpm-workspace.yaml',
        pattern: /^packages:\r?$/m,
        template: "  - '{{projectName}}'",
      },
      'Next: pnpm install, then run pnpm dev from the new project directory',
    ],
  })
}
