import { FC, MouseEventHandler, useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    Container,
    Heading,
    HStack,
    Text,
    VStack
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Metaplex, walletAdapterIdentity, CandyMachineV2 } from "@metaplex-foundation/js";
import { useRouter } from "next/router";
import * as web3 from "@solana/web3.js";


const Connected: FC = () => {

    const [candyMachine, setCandymachine] = useState<CandyMachineV2>();
    const [mintingState, setMintingState] = useState(false);


    const walletAdapter = useWallet();
    const {connection} = useConnection();

    const router = useRouter();

    const metaplex = useMemo(() => {
        return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    }, [connection, walletAdapter])


    useEffect(()=>{
        console.log(metaplex);
        if(!metaplex){
            console.log("No metaplex")
            return
        }
        metaplex.candyMachinesV2().findByAddress({address: new web3.PublicKey("8yxqPBSg5P3A7no8WCjEYrowPXNJ5dhVghKgm3qVvgwY")}).then((candymachine) => {
            setCandymachine(candymachine)
        }).catch((error) => {
            alert(error)
        });
        
    },[metaplex])

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback( async (event) => {
        if(event.defaultPrevented){
            return
        }
        if(!walletAdapter.connected || !candyMachine){
            console.log("lol", candyMachine)
            return
        }
        try{
            setMintingState(true);
            const nft = await metaplex.candyMachinesV2().mint({candyMachine})
            console.log("NFT , " , nft);

            router.push(`/newMint?mint=${nft.nft.address.toString()}`)
        }
        catch(error){
            alert(error);
        }
        finally{
            setMintingState(false);
        }
    },[walletAdapter, connection, metaplex, candyMachine])

    return (
        <Container>
            <VStack spacing={20}>
                <Heading
                    color="white"
                    as="h1"
                    size="3xl"
                    noOfLines={2}
                    textAlign="center"
                >
                    Mint your NeroNFT. Earn $NER. Level up!
                </Heading>
                <Button
                    bgColor="accent"
                    color="black"
                    maxW="380px"
                    onClick={handleClick}
                >
                    <HStack>
                        <Text>Mint</Text>
                        <ArrowForwardIcon/>
                    </HStack>
                </Button>
            </VStack>
        </Container>
    )
}

export default Connected