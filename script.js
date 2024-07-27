const { ethers } = require('ethers');
require('dotenv').config();

// Connect to the Binance Smart Chain
const provider = new ethers.JsonRpcProvider('https://bsc-mainnet.nodereal.io/v1/9cfc2dcfa7a84a2e953cfce3a60e4348');

// Your wallet private key (keep this secret and use environment variables in production!)
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// ERC20 token contract address
const tokenAddress = '0x315D6f9D775DaA04Bc9e36100c8A82377846Dbc6';

// Recipient address
const recipientAddress = '0x3E31CDe71332Dd6a47A9575C9747887bb90E1f73';

// ERC20 ABI (minimal ABI for transfer function)
const erc20Abi = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)'
];

// Create contract instance
const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

// Prepare transfer transaction
async function prepareTransferTx(amount) {
  const tx = await tokenContract.transfer.populateTransaction(recipientAddress, amount);
  tx.gasPrice = ethers.parseUnits('12', 'gwei');
  tx.gasLimit = 100000; // Set a fixed gas limit to avoid estimation delay
  return tx;
}

// Function to execute ERC20 transfer
async function transferERC20(amount) {
  try {
    console.log(`Initiating ERC20 transfer of ${ethers.formatUnits(amount, 18)} tokens...`);
    
    const tx = await prepareTransferTx(amount);
    
    // Send the transaction
    const response = await wallet.sendTransaction(tx);
    console.log(`Transaction sent: ${response.hash}`);
    
    // Don't wait for confirmation to improve speed
    return true;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    return false;
  }
}

// Function to check balance
async function checkBalance(address) {
  try {
    return await provider.getBalance(address);
  } catch (error) {
    console.error('Error checking balance:', error);
    return 0n;
  }
}

// Main function
async function main() {
  const address = await wallet.getAddress();
  console.log(`Monitoring address: ${address}`);
  
  let lastKnownBalance = await checkBalance(address);
  console.log(`Initial balance: ${ethers.formatEther(lastKnownBalance)} BNB`);

  // Check balance very frequently
  const checkInterval = 10; // Check every 10 milliseconds
  let checkCount = 0;
  
  const intervalId = setInterval(async () => {
    try {
      checkCount++;
      const currentBalance = await checkBalance(address);
      
      if (currentBalance > lastKnownBalance) {
        console.log(`Check #${checkCount}: New balance detected: ${ethers.formatEther(currentBalance)} BNB`);
        
        // Stop checking balance
        clearInterval(intervalId);
        
        // Check token balance
        const tokenBalance = await tokenContract.balanceOf(wallet.address);
        console.log(`Current token balance: ${ethers.formatUnits(tokenBalance, 18)}`);
        
        // Calculate maximum transferrable amount (leaving a small buffer for rounding errors)
        const maxTransferAmount = tokenBalance - ethers.parseUnits('0.000001', 18);
        
        if (maxTransferAmount <= 0) {
          console.error('Insufficient token balance for transfer');
          process.exit(1);
        }
        
        // Initiate transfer immediately
        transferERC20(maxTransferAmount).then(success => {
          if (success) {
            console.log('Transfer initiated successfully');
          } else {
            console.log('Transfer initiation failed');
          }
          process.exit(0);
        });
      }
      
      lastKnownBalance = currentBalance;
    } catch (error) {
      console.error('Error in balance checking:', error);
    }
  }, checkInterval);
}

main().catch(console.error);