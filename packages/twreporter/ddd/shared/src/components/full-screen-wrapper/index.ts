import './FullScreenWrapper.wc.svelte'
import schemaUrl from '../../../dist/components/full-screen-wrapper/full-screen-wrapper.schema.json?url&no-inline'

export { schemaUrl }
export { createWrapperController } from './controller.svelte.ts'
export type { WrapperController } from './controller.svelte.ts'
export { createConnection, fullScreenWrapperRpcChannel } from './rpc.ts'
export type { WrapperApi } from './rpc.ts'
