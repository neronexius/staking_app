import { NextPage } from "next";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import {VStack, Container, Heading, Text, Image, Button, HStack} from "@chakra-ui/react";
import MainLayout from "../components/MainLayout";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useState, useMemo, useEffect, MouseEventHandler, useCallback } from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";

const NewMint: NextPage<NewMintProps> = ({mint}) => {
    const router = useRouter();
    const [metadata, setMetaData] = useState<any>();
    const {connection} = useConnection();
    const walletAdapter = useWallet();
    
    const metaplex = useMemo(()=> {
        return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    }, [walletAdapter, connection])

    useEffect(()=>{
        console.log("What is mint", mint)
        metaplex.nfts().findByMint({mintAddress: new PublicKey(mint)}).then((nft)=> {
            fetch(nft.uri).then((res)=>{
                res.json().then((metadata)=> {
                    setMetaData(metadata)
                })
            })
        }) 
    },[mint, metaplex, walletAdapter])

     

    const handleClick:MouseEventHandler<HTMLButtonElement> = useCallback(
        async (event) => {
          router.push(`/stake`)

        }, []
    )


    return (
        <MainLayout>
          <VStack spacing={20}>
            <Container>
              <VStack spacing={8}>
                <Heading color="white" as="h1" size="2xl" textAlign="center">
                  😮 A new buildoor has appeared!
                </Heading>
    
                <Text color="white" fontSize="xl" textAlign="center">
                  Congratulations, you minted a lvl 1 buildoor! <br />
                  Time to stake your character to earn rewards and level up.
                </Text>
              </VStack>
            </Container>
    
            <Image src={metadata?.image ?? ""} alt="" boxSize={"120px"} />
    
            <Button
              bgColor="accent"
              color="white"
              maxW="380px"
              onClick={handleClick}
            >
              <HStack>
                <Text>stake my buildoor</Text>
                <ArrowForwardIcon />
              </HStack>
            </Button>
          </VStack>
        </MainLayout>
      )
}


interface NewMintProps {
    mint: PublicKey
}

//geting props from queryyyy
NewMint.getInitialProps = async ({query}) => {
    const {mint} = query;

    if(!mint) throw {error: "no mint"}

    try {
        const mintPubkey = new PublicKey(mint)
        return {mint: mintPubkey}
    }catch(error){
        throw {error: "Invalid Mint"}
    }
}

export default NewMint;