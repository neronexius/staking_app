import {useState, useEffect, FC, useCallback, ReactNode, MouseEventHandler, useMemo} from "react";
import { Box, Text, VStack, Image, Button, HStack  } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {useWallet, useConnection} from "@solana/wallet-adapter-react";
import { useWorkspace } from "./WorkspaceProvider";
import { PublicKey, Transaction } from "@solana/web3.js";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import * as token from "@solana/spl-token"
import { Metaplex, bundlrStorage, walletAdapterIdentity } from "@metaplex-foundation/js"


const NftCard = (props:any) => {
    const walletAdapter = useWallet();
    const {connection} = useConnection();
    const workspace = useWorkspace();
    const [imageUri, setImageUri] = useState("");
    const [pdaInfo, setPdaInfo] = useState<any>();
    const [tokenAccount, setTokenAccount] = useState<any>();
    const program = workspace.program;



    useEffect(() => {
        if (!program || !walletAdapter || !walletAdapter.publicKey) return
        console.log("props" , props.data)
        

        getStakeAccount(program, walletAdapter.publicKey, props.data.mintAddress)
        getImageUri()
    },[walletAdapter])

    const handleClick:MouseEventHandler<HTMLButtonElement> = useCallback(
        async (event) => {
            if(!workspace || !walletAdapter.connected || !walletAdapter.publicKey || !props.data.address || !program || !program.provider) return 
            let [tokenEdition] = PublicKey.findProgramAddressSync([Buffer.from("metadata"),METADATA_PROGRAM_ID.toBuffer(), props.data.mintAddress.toBuffer(), Buffer.from("edition") ],METADATA_PROGRAM_ID )

            if(!pdaInfo || pdaInfo.stakeState.unstaked){
                try{
                    const transaction = new Transaction();   
                    let ix = (await program.methods
                        .stake()
                        .accounts({
                        nftTokenAccount:tokenAccount,
                        nftMint: props.data.mintAddress,
                        nftEdition: tokenEdition,
                        metadataProgram: METADATA_PROGRAM_ID
                        })
                        .instruction())
                    if (!ix){
                        return
                    }
                    transaction.add(ix);

                    let tx = await walletAdapter.sendTransaction(transaction,connection);

                    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
                    let blockhash = (await program.provider.connection.getConfirmedTransaction(tx))?.transaction.recentBlockhash;
                    await updatedBlockHash(program);
                    await getStakeAccount(program, walletAdapter.publicKey, props.data.mintAddress)
                }catch(error){                    
                    console.log(error)
                }
            }
            else{
                try{
                    console.log("Unstake!")
                    let [mint] = PublicKey.findProgramAddressSync([Buffer.from("mint")], program.programId);
                    let ata = token.getAssociatedTokenAddressSync(mint,walletAdapter.publicKey)
                    const transaction = new Transaction();
                    let ix = await program
                    .methods
                    .unstake()
                    .accounts({
                        nftTokenAccount: tokenAccount,
                        nftMint: props.data.mintAddress,
                        nftEdition: tokenEdition,
                        stakeMint: mint,
                        userStakeAta: ata,
                        metadataProgram: METADATA_PROGRAM_ID
                    })
                    .instruction()

                    transaction.add(ix);
                    let tx = await walletAdapter.sendTransaction(transaction, connection);
                    console.log(tx);
                    await updatedBlockHash(program);
                    await getStakeAccount(program, walletAdapter.publicKey, props.data.mintAddress)
                    }
                catch(error){
                    console.log(error)
                }
            }

        }, [pdaInfo, tokenAccount, walletAdapter]
    )

    const getImageUri = async() => {
        let image_uri_json = await fetch(props.data.uri);
        let uri = await image_uri_json.json()
        setImageUri(uri.image)
    }
    
    const getStakeAccount = async(
        program:any,
        user: PublicKey,
        nft: PublicKey,
        hash?: any
    ) => {
        const token_account = token.getAssociatedTokenAddressSync(nft,user);
        const [stake_pda] = PublicKey.findProgramAddressSync([
            user.toBuffer(), token_account.toBuffer()
        ], program.programId);
        setTokenAccount(token_account)
        try{
            let pda_info = await program.account.userStakeInfo.fetch(stake_pda); 
            console.log("pda_info : hi", pda_info)
            return setPdaInfo(pda_info)
        }
        catch(error){
            console.log("null", error)
        }
        
    }

    const updatedBlockHash = async(program:any) => {
        if(program){
            let current_hash = (await program.provider.connection.getLatestBlockhash()).blockhash
            let new_hash = (await program.provider.connection.getLatestBlockhash()).blockhash
            while (current_hash == new_hash){
                new_hash = (await program.provider.connection.getLatestBlockhash()).blockhash
                console.log("loop! new hash : ", new_hash)
            }
            return
        }
    }

    return (
        <VStack>
                <Image src={imageUri ?? ""} alt="" boxSize={"120px"} />
                <Button
                    bgColor="accent"
                    color="black"
                    maxW="380px"
                    onClick={handleClick}
                >
                    <HStack>
                        <Text>{pdaInfo && pdaInfo.stakeState.staked ? "UnStake" : "Stake"}</Text>
                        <ArrowForwardIcon />
                        
                    </HStack>
                </Button>
                <Button
                onClick={()=>{console.log(pdaInfo)}}
                >
                    Ermm
                </Button>
            </VStack>
    )
}

export default NftCard