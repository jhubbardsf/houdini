import path from 'path'
import { Config } from '../../../common'
import { ArtifactKind, CollectedGraphQLDocument } from '../../types'
import { writeFile } from '../../utils'

export async function generateIndividualStore(config: Config, doc: CollectedGraphQLDocument) {
	const prefix = 'KQL_'

	const imports = [
		// `import { browser } from '$app/env'`,
		`import { writable } from 'svelte/store'`,
	]

	const queriesStore: string[] = []
	const queriesStoreDTs: string[] = []

	if (doc.kind === ArtifactKind.Query) {
		const storeName = `${prefix}${doc.name}` // "KQL_AllItems"

		// STORE
		const queryStoreGenerated = `function ${storeName}Store() {
  const operationName = '${storeName}'
  const { subscribe, set, update } = writable({ from: 'NO_DATA', data: null })

  async function queryLocal() {
    // 0/ Prepare the result
    let toReturn = {
      from: 'CACHE',
      data: null,
    }

    // 1/ From Cache?
    // ...

    // 2/ Not from Cache
    // ...
    toReturn = { ...toReturn, ...{ data: 1, from: 'NETWORK' } }

    set(toReturn)
    return toReturn
  }

  return {
    subscribe,

    /**
     * Will trigger the query
     */
    query: queryLocal(),

    // We don't want to give the option to set or update the store manually
    // set, update
  }
}

export const ${storeName} = ${storeName}Store()`
		queriesStore.push(queryStoreGenerated)
		// STORE END

		// TYPES
		const queryStoreGeneratedDTs = `export type ${storeName} = {
  subscribe: (
    this: void,
    run: Subscriber<{
      from: string
      data: any
    }>,
    invalidate?: Invalidator<{
      from: string
      data: any
    }>
  ) => Unsubscriber
  query: () => {
    data: number
    from: 'CACHE' | 'NETWORK'
  }
}

export declare const ${storeName}: ${storeName}`
		queriesStoreDTs.push(queryStoreGeneratedDTs)
		// TYPES END

		const data = imports.join(`\n`) + `\n` + queriesStore.join(`\n`)
		await writeFile(path.join(config.rootDir, 'stores', `${storeName}.js`), data)

		const dataDTs = queriesStoreDTs.join(`\n`)
		await writeFile(path.join(config.rootDir, 'stores', `${storeName}.d.ts`), dataDTs)

		console.log(`✅ ${storeName} store`)

		return storeName
	}

	return null
}
