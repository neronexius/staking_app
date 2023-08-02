import { Box, Center, Spacer, Stack, Image, Text, HStack, Button } from "@chakra-ui/react";
import type { NextPage } from "next"
import Head from "next/head";
import styles from "../styles/Home.module.css"; 
import NavBar from "./NavBar";
// import Disconnected from "./components/Disconnect";
// import Connected from "../components/Connected";
import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { MouseEventHandler, ReactNode, useCallback, FC } from "react";

const MainLayout:FC<{children: ReactNode}> = ({ children }) => {
  const { connected } = useWallet();

    return (
        <div className = {styles.container}>
            <Head>
                <title>CRABB</title>
                <meta name="The NFT Collection for Buildor"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Box
                w = "full"
                h = "calc(100vh)"
                bgImage = {`url('/background.jpeg')`}
                backgroundPosition = "center"
            >
              <Stack
                w="full"
                h="calc(100vh)"
                justify="center"
              >
                <NavBar/>

                <Spacer/>

                <Center>
                  {children}
                </Center>

                <Spacer/> 

                <Center>
                  <Box
                    marginBottom={4} color="white"
                  >
                    <a
                      href="https://twitter.com/NeroNFTs"
                      target="_blank"
                      rel="noopener noreferrer">
                        Built with Nero_space
                      </a>

                  </Box>
                </Center>


              </Stack>


            </Box>
        </div>
    )
}

export default MainLayout;