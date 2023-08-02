import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StakingApp } from "../target/types/staking_app";
import * as associatedToken from "@solana/spl-token";
import {expect} from "chai";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { setupNft } from "./utils/setUpNft";

const MINT = new anchor.web3.PublicKey("7QSFTdoEfNbfR64ApnYuokLys4cTbBTxPFUxMfTSnVfg");


describe("staking_app", async () => {
  
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.StakingApp as Program<StakingApp>;

  const [mint_address] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("mint")], program.programId);


  const receivedAccount = associatedToken.getAssociatedTokenAddressSync(mint_address, provider.wallet.publicKey)

  const wallet = anchor.workspace.StakingApp.provider.wallet;

  let delegatedAuthPda: anchor.web3.PublicKey
  let stakeStatePda: anchor.web3.PublicKey
  let nft: any
  let mintAuth: anchor.web3.PublicKey
  let mint: anchor.web3.PublicKey
  let tokenAddress: anchor.web3.PublicKey

  before(async () => {
    ;({ nft, delegatedAuthPda, stakeStatePda, mint, mintAuth, tokenAddress } =
      await setupNft(program, wallet.payer))
  })


  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("initialize mint", async () => {
  //  try{ const tx = await program
  //   .methods
  //   .initializeMint()
  //   .accounts({
  //     mint: mint_address
  //   })
  //   .rpc();
  //   console.log(`Mint initialized https://explorer.solana.com/tx/${tx}?cluster=custom`)
  // }
  // catch(error){
  //   console.log("error", error)
  // }
  // })

  // it("Mint Token" , async() => {
  //   try{
  //   const tx = await program
  //   .methods
  //   .mintToken()
  //   .accounts({
  //     receiveAccount: receivedAccount,
  //     mint:mint_address,
  //   })
  //   .rpc()

  //   const ass_acc = await provider.connection.getTokenAccountBalance(receivedAccount);
    
  //   console.log(`Token Minted https://explorer.solana.com/tx/${tx}?cluster=custom`)

  // }catch(error){
  //   console.log("error: ", error)
  // }
  // })

  it("Staking NFT", async() => {

    console.log("nft tokenAccount: ", (await provider.connection.getAccountInfo(nft.tokenAddress))?.owner.toString())
    console.log("nft mint: ", (await provider.connection.getAccountInfo(nft.mintAddress))?.owner.toString())
    console.log("nft nft edition: ", (await provider.connection.getAccountInfo(nft.masterEditionAddress))?.owner.toString())

    try{
      let tx = await program.methods
      .stake()
      .accounts({
        nftTokenAccount: nft.tokenAddress,
        nftMint: nft.mintAddress,
        nftEdition: nft.masterEditionAddress,
        metadataProgram: METADATA_PROGRAM_ID,
      })
      .rpc()
      const account = await program.account.userStakeInfo.fetch(stakeStatePda);

      expect(account.status === "Staked")

    }catch(error){
      console.log("PDA : ", stakeStatePda.toString())
      console.log(error)
    }
  })

  // it("Redeem", async()=> {
  //     try{
  //       const tx = await program
  //       .methods
  //       .redeem()
  //       .accounts({
  //         stakePda: stakeStatePda,
  //         nft: nft.tokenAddress,
  //         userAta: receivedAccount,
  //         mint: mint_address
  //       })
  //       .rpc()
  //       console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  //     }
  //     catch(error){
  //       console.log("ERROR", error)
  //     }
  // })

  // it("Unstake", async() => {
  //   try{
  //     const tx = await program
  //     .methods
  //     .unstake()
  //     .accounts({
  //       metadataProgram: METADATA_PROGRAM_ID,
  //       nft: nft.tokenAddress,
  //       nftMint: nft.mintAddress,
  //       nftEdition: nft.masterEditionAddress,
  //       mint: mint_address,
  //       userAta: receivedAccount
  //     })
  //     .rpc()

  //     const account = await program.account.stakingState.fetch(stakeStatePda)
  //     console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  //     expect(account.status === "Unstaked");
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // })
  it("Redeems", async () => {
   try{await program.methods
      .redeem()
      .accounts({
        nftTokenAccount: nft.tokenAddress,
        stakeMint: mint_address,
        userStakeAta: receivedAccount,
      })
      .rpc()

    const account = await program.account.userStakeInfo.fetch(stakeStatePda)
    expect(account.stakeState === "Staked")}
    catch(error){
      console.log(error)
    }

  })

  it("Unstakes", async () => {
    try{await program.methods
      .unstake()
      .accounts({
        nftTokenAccount: nft.tokenAddress,
        nftMint: nft.mintAddress,
        nftEdition: nft.masterEditionAddress,
        metadataProgram: METADATA_PROGRAM_ID,
        stakeMint: mint_address,
        userStakeAta: receivedAccount,
      })
      .rpc()

    const account = await program.account.userStakeInfo.fetch(stakeStatePda)
    expect(account.stakeState === "Unstaked")}catch(error){
      console.log(error)
    }
  })

});
