import { useState } from 'react'
import { Box, Title, Button } from '@mantine/core'

import Page from '~/c/Page.jsx'
import { Query, graphql } from '~/c/graphql.jsx'

const LIST = `
query LIST {
  list {
    id
    items {
      id
      name {
        english
        japanese
        chinese
      }
    }
  }
}
`

const ADD_ONE = `
mutation ADD_ONE {
  add {
    id
    items {
      id
      name {
        english
        japanese
        chinese
      }
    }
  }
}
`

function ShowResults ({ data: { list } }) {
  return (
    <div>
      <div>{list.length} records</div>
      {list.map(item => (<div key={item.id}>{item.id}</div>))}
    </div>
  )
}

export default function () {
  const [redraw, setRedraw] = useState({ id: 'none' })

  const add = async () => {
    setRedraw((await graphql(ADD_ONE)).add)
  }

  return (
    <Page>
      <Box>
        <Title order={3}>Pokemon Item lists</Title>
        Here is a list of the ids of things you added
        <Button onClick={add}>Add One</Button>
        <div>
          <Query key={redraw.id} query={LIST}>
            <ShowResults />
          </Query>
        </div>
        <Title order={3}>Last Add</Title>
        <pre>{JSON.stringify(redraw, null, 2)}</pre>
      </Box>
    </Page>
  )
}
