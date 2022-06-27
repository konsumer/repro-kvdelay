import React, { useEffect, useState } from 'react'
import { MantineProvider, ActionIcon, useMantineTheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons'

// setup mantine context & theme
export function ColorSchemeProvider ({ children }) {
  const m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
  const [colorScheme, setColorScheme] = useState(window.localStorage.theme ? window.localStorage.theme : (m?.matches ? 'dark' : 'light'))

  const onChaangeMedia = event => {
    setColorScheme(window.localStorage.theme ? window.localStorage.theme : (event.matches ? 'dark' : 'light'))
  }

  const onChangeStorage = () => {
    setColorScheme(window.localStorage.theme ? window.localStorage.theme : (m?.matches ? 'dark' : 'light'))
  }

  useEffect(() => {
    if (m) {
      m.addEventListener('change', onChaangeMedia)
      window.addEventListener('storage', onChangeStorage)
      return () => {
        m.removeEventListener('change', onChaangeMedia)
        window.removeEventListener('storage', onChangeStorage)
      }
    }
  }, [])

  return (
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  )
}

// button for toggling color-scheme via localStorage.theme
export function ColorSchemeButton () {
  const theme = useMantineTheme()
  const onClick = () => {
    window.localStorage.setItem('theme', theme.colorScheme === 'dark' ? 'light' : 'dark')
    window.dispatchEvent(new Event('storage'))
  }
  return (
    <ActionIcon onClick={onClick} variant='filled'>
      {theme.colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
    </ActionIcon>
  )
}
