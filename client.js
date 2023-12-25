const anchor = require("@project-serum/anchor");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { Connection, clusterApiUrl} = require('@solana/web3.js')
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;

console.log(anchor)
console.log('*****************')

const main = async () => {
    // Configure the connection to the local cluster.
  const connection = new Connection(clusterApiUrl('devnet'))

    // const provider = anchor.Provider.env('https://api.devnet.solana.com')
    // anchor.setProvider(provider)

//     // Fetch the program ID from the Anchor IDL file.

    const idl = JSON.parse(require("fs").readFileSync("target/idl/calculator.json", "utf8"));
    console.log(idl)
    // const programId = new anchor.web3.PublicKey(idl.metadata.address);
    const programId = 'HLJ32AiDUqWToLVgAtcgdAZX6KPYyxtGyBgpCvTpajug'

    // Set the accounts and instruction data.
    const mint = anchor.web3.Keypair.generate();
    console.log(mint)

    const recipient = anchor.web3.Keypair.generate();
    console.log(recipient)
    const authority = connection.wallet.publicKey;
    console.log(authority)
    const instructionData = new Uint8Array([
      // Replace this with the correct instruction data.
      // This is just an example.
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    ]);
   
    // Build the transaction.
    const transaction = new anchor.web3.Transaction();
    
    transaction.add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(Token.MINT_SIZE),
        space: Token.MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        2,
        authority,
        authority
      ),
      Token.createAssociatedTokenAccountInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        recipient.publicKey,
        authority,
        provider.wallet.publicKey
      ),
      new anchor.web3.TransactionInstruction({
        data: instructionData,
        keys: [
          { pubkey: mint.publicKey, isSigner: false, isWritable: true },
          { pubkey: recipient.publicKey, isSigner: false, isWritable: true },
          { pubkey: authority, isSigner: true, isWritable: false },
        ],
        programId,
      })
    );
  
    // Send the transaction.
    const signature = await provider.sendAndConfirm(transaction);
    console.log("Transaction signature:", signature);
  };
  
  main();