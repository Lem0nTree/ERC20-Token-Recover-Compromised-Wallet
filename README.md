# 🚀 BNB to ERC20 Transfer Script

This script monitors a BSC wallet for incoming BNB and automatically transfers a specified ERC20 token upon detection.

## 🌟 Features

- 🔍 Real-time monitoring of BNB balance
- ⚡ Fast reaction to incoming BNB
- 💸 Automatic ERC20 token transfer
- ⚙️ Configurable gas price and token amount

## 📋 Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)
- A BSC wallet with:
  - BNB for gas fees
  - The ERC20 token you want to transfer

## 🛠️ Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/bnb-to-erc20-transfer-script.git
   cd bnb-to-erc20-transfer-script
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   PRIVATE_KEY=your_wallet_private_key_here
   ```

## ⚙️ Configuration

Edit the following variables in `script.js`:

- `tokenAddress`: The contract address of your ERC20 token
- `recipientAddress`: The address to receive the ERC20 tokens
- `checkInterval`: How often to check for new BNB (in milliseconds)

## 🚀 Usage

Run the script:

```
node script.js
```

The script will start monitoring your wallet for incoming BNB. When BNB is detected, it will automatically transfer the maximum available balance of the specified ERC20 token to the recipient address.

## ⚠️ Important Notes

- 🔒 Keep your private key secure! Never share your `.env` file.
- 💰 Ensure your wallet has enough BNB for gas fees.
- 🏎️ The script is optimized for speed and may not wait for transaction confirmations.
- 📡 Frequent balance checks may put a high load on your node provider.

## 🔧 Customization

### Adjusting Gas Price

To change the gas price, modify the `prepareTransferTx` function:

```javascript
tx.gasPrice = ethers.parseUnits('15', 'gwei'); // Adjust as needed
```

### Changing Transfer Amount

To transfer a specific amount instead of the maximum, modify the `main` function:

```javascript
const transferAmount = ethers.parseUnits('100', 18); // Adjust amount and decimals
await transferERC20(transferAmount);
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/bnb-to-erc20-transfer-script/issues).

## 👨‍💻 Author

Your Name
- GitHub: [@lem0ntree](https://github.com/lem0ntree)

## 🙏 Acknowledgements

- [ethers.js](https://docs.ethers.io/v5/)
- [Binance Smart Chain](https://www.binance.org/en/smartChain)

---

⭐️ If you find this project useful, please give it a star on GitHub! ⭐️