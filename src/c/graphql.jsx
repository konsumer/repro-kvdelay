// very simple graphql query with loader & error

/* global fetch */

import { Alert, Loader } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons'
import { cloneElement, useState, useEffect, useMemo } from 'react'

// simple graphql client
// modify this to work however you want
export async function graphql (query, variables = {}, endpoint = '/api') {
  const r = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'content-type': 'application/json'
    }
  })

  if (r.status !== 200) {
    const e = new Error(`HTTP (${r.status}): ${r.statusText}`)
    e.request = r
    throw e
  }

  const { data, errors } = await r.json()
  if (errors) {
    const e = new Error('Graphql Errors: ' + errors.map(e => `${e.message} at ${e.locations[0].line}:${e.locations[0].column}`).join('\n'))
    e.request = r
    e.errors = errors
    throw e
  }

  return data
}

export function Query ({ query, variables = {}, children = null, showErrors, errorTitle = 'Error' }) {
  const [data, setData] = useState()
  const [error, setError] = useState()

  // this makes useEffect change-detection work right
  const vars = JSON.stringify(variables)

  useEffect(() => {
    graphql(query, variables)
      .then(d => setData(d))
      .catch(e => setError(e))
  }, [query, vars])

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={errorTitle} color='red'>
        {showErrors ? error.message : 'Something bad happend with your request.'}
      </Alert>
    )
  }

  if (!data) {
    return (<Loader />)
  }

  return typeof children === 'function' ? children(data) : cloneElement(children, { data })
}
