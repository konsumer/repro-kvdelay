import { graphql } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

import typeDefs from './typeDefs.gql'

export const resolvers = {
  Query: {
    hello (_, { name }) {
      return `Helo ${name}!`
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
