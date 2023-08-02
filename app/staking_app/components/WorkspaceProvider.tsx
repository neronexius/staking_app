import { 
    FC,
    ReactNode,
    createContext, 
    useContext 
} from "react";

import { 
    Program, 
    AnchorProvider, 
    Idl, 
    setProvider 
} from "@coral-xyz/anchor";

import { 
    Connection,
    PublicKey
} from "@solana/web3.js";

import { 
    useAnchorWallet, 
    useConnection 
} from "@solana/wallet-adapter-react";

import { 
    IDL 
} from "../utils/staking_app"

import idl from "../utils/staking_app.json";

const WorkspaceContext = createContext({});

interface Workspace {
    connection?: Connection,
    provider?: AnchorProvider,
    program?: Program
}

const WorkspaceProvider:FC<{ children: ReactNode }> = ({children}: any) => {
    const wallet = useAnchorWallet() || MockWallet;
    const { connection } = useConnection();

    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);

    const programId = new PublicKey(idl.metadata.address);

    const program = new Program(IDL as Idl, programId);

    const workspace = {
        connection,
        provider,
        program
    }

    return (
        <WorkspaceContext.Provider value={workspace}>
            {children}
        </WorkspaceContext.Provider>
    )
    
}   

const useWorkspace = (): Workspace => {
    return useContext(WorkspaceContext)
}

export {useWorkspace, WorkspaceProvider}

import { Keypair } from "@solana/web3.js"

const MockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
}

export default MockWallet