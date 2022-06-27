import {
  AppShell,
  Header,
  Text,
  Title,
  Group
} from '@mantine/core'

import { ColorSchemeButton } from '~/c/ColorScheme.jsx'

export default function Page ({ children }) {
  return (
    <AppShell
      styles={theme => ({
        main: {
          background: theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0]
        }
      })}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      fixed
      header={
        <Header height={70} p='sm'>
          <Group position='apart'>
            <Title>Your App</Title>
            <ColorSchemeButton />
          </Group>
        </Header>
      }
    >
      <Text>{children}</Text>
    </AppShell>
  )
}
