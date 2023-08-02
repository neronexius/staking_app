import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/NavBar'
import {Box, Text } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import NotConnected from "@/components/NotConnected"
import Connected from "@/components/Connected"
import {useWallet} from "@solana/wallet-adapter-react"


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const wallet = useWallet();

  return (
    <>
      <Head>
        <title>God App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MainLayout>
          {wallet.connected ? <Connected/> :<NotConnected/>}
        </MainLayout>
      </main>
    </>
  )
}
