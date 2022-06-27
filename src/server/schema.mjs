import { graphql } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

import pokemonItems from '../pokemon_data.json'
import typeDefs from './typeDefs.gql'

export const resolvers = {
  Query: {
    async list (_, a, { POKEMON }) {
      const { keys } = await POKEMON.list()
      return Promise.all(keys.map(({ name }) => POKEMON.get(name, { type: 'json' })))
    }
  },

  Mutation: {
    add (_, a, { POKEMON }) {
      const items = [...pokemonItems]
      const id = Date.now().toString()
      const record = { id, items }
      POKEMON.put(id, JSON.stringify(record))
      return record
    }
  }
}

export const getSchema = () => makeExecutableSchema({ resolvers, typeDefs })

// get an in-memory client for the graphql resolvers
export const getClient = async (context = {}) => {
  if (!getClient.schema) {
    getClient.schema = getSchema()
  }

  return (query, variables = {}) => graphql({
    schema: getClient.schema,
    source: query,
    contextValue: context,
    variableValues: variables
  })
}
