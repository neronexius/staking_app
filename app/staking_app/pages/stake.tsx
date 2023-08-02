import { NextPage } from "next";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import {VStack, Container, Heading, Text, Image, Button, HStack, Box} from "@chakra-ui/react";
import MainLayout from "../components/MainLayout";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useState, useMemo, useEffect, MouseEventHandler, useCallback } from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import NftCard from "@/components/NftCard";
import * as web3 from "@solana/web3.js"
const Stake: NextPage = () => {
    const router = useRouter();
    const {connection} = useConnection();
    // const [nfts, setNfts] = useState([]);
    const walletAdapter = useWallet();
    const [metaDatas, setMetaDatas] = useState<any>([])
  

    
    const metaplex = useMemo(()=> {
        return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    }, [walletAdapter, connection])

    //You have to fix why it render NFT when it disconnect from wallet
    useEffect(() => {
        const fetchMetadata = async () => {
          if(!walletAdapter.publicKey){
            setMetaDatas([])
            return
          }
          const ownerNfts = await metaplex.nfts().findAllByOwner({ owner: walletAdapter.publicKey });
    
          for (let i = 0; i < ownerNfts.length; i++) {
            if (ownerNfts[i].collection?.address.toBase58() ===  new web3.PublicKey("59EvfpWQseBKDZ94m4aUGS6gkrCBGz5NM2kZEQGgLMrq").toBase58()){
              
                setMetaDatas((prevMetadata:any) => [...prevMetadata, ownerNfts[i]]);
            }
          }
        };
        fetchMetadata();
      }, [walletAdapter.connected]);     


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
            <HStack>
            {metaDatas && metaDatas.length > 0 && metaDatas.map((meta:any, index:number) => {
              return(
                <NftCard
                key={index}
                data = {meta}
                />
                
            )}
            )}
    
            </HStack>
          </VStack>
        </MainLayout>
      )
}




export default Stake;