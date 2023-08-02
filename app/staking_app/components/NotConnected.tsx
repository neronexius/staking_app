import { FC, MouseEventHandler, useCallback} from "react";
import {
    Button,
    Container,
    Heading,
    HStack,
    Text,
    VStack
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const NotConnected: FC = () => {

    const {wallet, connect} = useWallet();
    const modalState = useWalletModal();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
        if(event.defaultPrevented){
            return
        }

        if(!wallet){
            console.log("You should be here")
            console.log(modalState)
            modalState.setVisible(true);
        }
        else{
            connect().catch(()=>{});
        }
    },[wallet, connect, modalState])

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
                        <Text>Become Nero's team</Text>
                        <ArrowForwardIcon/>
                    </HStack>
                </Button>
            </VStack>
        </Container>
    )
}

export default NotConnected