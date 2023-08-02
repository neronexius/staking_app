import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, theme } from '@chakra-ui/react'
import WalletContextProvider from '@/components/WalletContextProvider'
import { WorkspaceProvider } from '@/components/WorkspaceProvider'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <WorkspaceProvider>
          <Component {...pageProps} />
        </WorkspaceProvider>
      </WalletContextProvider>
    </ChakraProvider>
  )

}
