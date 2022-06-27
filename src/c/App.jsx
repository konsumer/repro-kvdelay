import { Box, Title } from '@mantine/core'

import Page from '~/c/Page.jsx'
import { Query } from '~/c/graphql.jsx'

const HELLO = `
query HELLO ($name: String!) {
  hello(name: $name)
}
`

function ShowResults ({ data }) {
  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

export default function () {
  return (
    <Page>
      <Box>
        <Title order={3}>Happy Path</Title>
        Here is an example of it working:
        <Query query={HELLO} variables={{ name: 'Cool Person' }}>
          <ShowResults />
        </Query>
      </Box>

      <Box mt='md'>
        <Title order={3}>Inline (no component)</Title>
        You can also do it inline, if you prefer that:
        <Query query={HELLO} variables={{ name: 'Fam' }}>
          {data => (
            <div>The server said: {data.hello}</div>
          )}
        </Query>
      </Box>

      <Box mt='md'>
        <Title order={3}>Error</Title>
        Here I leave out the required name to trigger an error:
        <Query query={HELLO}>
          <ShowResults />
        </Query>
      </Box>

      <Box mt='md'>
        <Title order={3}>Error with dev-info</Title>
        Here I leave out the required name to trigger an error, and set showErrors to show the actual errors:
        <Query query={HELLO} showErrors>
          <ShowResults />
        </Query>
      </Box>
    </Page>
  )
}
