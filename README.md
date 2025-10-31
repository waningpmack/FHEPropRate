# FHEPropRate - Privacy-Preserving Property Rating Platform

[![FHEVM](https://img.shields.io/badge/FHEVM-0.8.0-blue)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

FHEPropRate is a privacy-preserving property rating platform built on FHEVM (Fully Homomorphic Encryption Virtual Machine), enabling secure multi-dimensional property evaluations without compromising user data confidentiality.

## 🚀 Features

- **Privacy-First Design**: Uses Fully Homomorphic Encryption (FHE) to protect user ratings
- **Multi-Dimensional Evaluation**: Rate properties across 6 dimensions (Location, Quality, Amenities, Transport, Value, Potential)
- **Decentralized Architecture**: Smart contracts deployed on Ethereum Sepolia testnet
- **Dual Environment Support**: Mock development environment + Real FHEVM production environment
- **Wallet Integration**: MetaMask integration with EIP-712 signature support
- **Real-time Statistics**: Encrypted computation of aggregated ratings with privacy preservation

## 🏗️ Architecture

### Smart Contracts (Solidity + FHEVM)
- **PropertyRatingContract**: Main contract handling property creation, encrypted ratings, and statistics
- **FHECounter**: Reference implementation for FHE operations
- **Deployed on Sepolia**: `0xc2EfBeA8f079f74a722Dc3Cf8201f6fc1040087F`

### Frontend (Next.js + TypeScript)
- **fheprop-rate-frontend**: Main application with FHEVM integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live statistics visualization with radar charts

### Development Tools
- **Hardhat**: Smart contract development and testing framework
- **@fhevm/hardhat-plugin**: FHEVM-specific Hardhat integration
- **Mock Environment**: Local development with simulated FHE operations

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/waningpmack/FHEPropRate.git
cd FHEPropRate
```

### 2. Install Dependencies

#### Smart Contracts
```bash
cd fhevm-hardhat-template
npm install
```

#### Frontend
```bash
cd ../fheprop-rate-frontend
npm install
```

### 3. Smart Contract Development

#### Compile Contracts
```bash
cd fhevm-hardhat-template
npx hardhat compile
```

#### Run Tests
```bash
npx hardhat test
```

#### Deploy to Local Network
```bash
npx hardhat node  # Terminal 1
npx hardhat deploy --network localhost  # Terminal 2
```

#### Deploy to Sepolia Testnet
```bash
# Set environment variables
export SEPOLIA_PRIVATE_KEY=your_private_key
export INFURA_API_KEY=your_infura_key

# Deploy
npx hardhat deploy --network sepolia
```

### 4. Frontend Development

#### Development Mode (Mock Environment)
```bash
cd fheprop-rate-frontend
npm run dev:mock
```

#### Production Mode (Real FHEVM)
```bash
npm run dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Privacy & Security

### FHEVM Integration
- **Encrypted Computations**: All rating calculations happen on encrypted data
- **Zero-Knowledge Operations**: Server/node operators cannot see individual ratings
- **Cryptographic Proofs**: Users provide zero-knowledge proofs for rating validity
- **Decentralized Oracle**: FHEVM oracle handles decryption requests

### Security Features
- **Access Control**: Only project creators can view aggregated statistics
- **Signature Verification**: EIP-712 compliant signature verification
- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: Comprehensive validation of encrypted inputs

## 📊 How It Works

### 1. Property Creation
- Project creators define property details and rating dimensions
- Smart contract initializes encrypted storage for ratings

### 2. Encrypted Rating Submission
- Users connect MetaMask wallet
- Frontend encrypts ratings using FHEVM client libraries
- Encrypted data submitted to blockchain
- Smart contract performs homomorphic operations

### 3. Statistics Computation
- Aggregated statistics computed on encrypted data
- Only authorized users can request decryption
- Decryption requires cryptographic signature verification

### 4. Privacy-Preserving Analytics
- Radar charts display dimension-wise averages
- All computations preserve individual rating privacy
- No third party can access raw rating data

## 🛠️ Tech Stack

### Blockchain Layer
- **FHEVM 0.8.0**: Fully Homomorphic Encryption Virtual Machine
- **Solidity 0.8.27**: Smart contract programming language
- **Hardhat**: Development and testing framework
- **Sepolia Testnet**: Ethereum test network deployment

### Frontend Layer
- **Next.js 16.0**: React framework with App Router
- **TypeScript 5.x**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **ethers.js**: Ethereum JavaScript library

### Development Tools
- **@fhevm/hardhat-plugin**: FHEVM Hardhat integration
- **@fhevm/mock-utils**: Local development mock utilities
- **MetaMask SDK**: Wallet integration
- **Vitest**: Unit testing framework

## 📁 Project Structure

```
FHEPropRate/
├── fhevm-hardhat-template/     # Smart contracts
│   ├── contracts/              # Solidity source files
│   ├── test/                   # Contract tests
│   ├── deploy/                 # Deployment scripts
│   └── hardhat.config.ts       # Hardhat configuration
├── fheprop-rate-frontend/      # Main application
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── fhevm/                  # FHEVM integration
│   └── scripts/                # Build utilities
├── frontend/                   # Reference implementation
└── docs/                       # Documentation
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in respective directories:

#### Smart Contracts (`fhevm-hardhat-template/.env`)
```bash
SEPOLIA_PRIVATE_KEY=your_private_key_without_0x
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Frontend (`fheprop-rate-frontend/.env.local`)
```bash
# Usually not needed for basic functionality
```

### Network Configuration

#### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
- **Block Explorer**: https://sepolia.etherscan.io/

#### Local Development
- **Chain ID**: 31337
- **RPC URL**: `http://127.0.0.1:8545`
- **Mock Mode**: Enabled for local testing

## 🧪 Testing

### Smart Contract Tests
```bash
cd fhevm-hardhat-template
npx hardhat test                    # Run all tests
npx hardhat test --grep "Property"  # Run specific tests
REPORT_GAS=true npx hardhat test   # Gas reporting
```

### Frontend Tests
```bash
cd fheprop-rate-frontend
npm run test                       # Run unit tests
npm run build                      # Build verification
```

## 🚢 Deployment

### Production Deployment Checklist
- [ ] Smart contracts deployed to Sepolia
- [ ] Contract addresses updated in frontend
- [ ] Frontend built and optimized
- [ ] Environment variables configured
- [ ] Domain and SSL configured
- [ ] Monitoring and logging set up

### Contract Verification
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For the FHEVM technology and documentation
- **Ethereum Foundation**: For the Sepolia testnet
- **OpenZeppelin**: For smart contract best practices
- **MetaMask**: For wallet integration support

## 📞 Support

For questions and support:
- Open an [issue](https://github.com/waningpmack/FHEPropRate/issues) on GitHub
- Check the [documentation](./docs/) for detailed guides
- Review the [FHEVM documentation](https://docs.zama.ai/fhevm) for technical details

---

**Built with ❤️ for privacy-preserving decentralized applications**

*Experience the future of private data computation on blockchain* 🚀
