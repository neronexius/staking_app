import {FC} from "react";
import {Box, Spacer, HStack, Text} from "@chakra-ui/react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

const NavBar:FC = () => {

    return(
        <Box 
        width={"100%"}
        >
        <HStack>
            <Text>Solana Logo Here</Text>

            <Spacer/>

            <WalletMultiButtonDynamic/>
        </HStack>
        </Box>
    )
}

export default NavBar