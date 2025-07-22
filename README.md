# PayEZ - Voice-Enabled Crypto Wallet 🎙️💰

> Making cryptocurrency accessible for everyone through voice commands

PayEZ is a Progressive Web App (PWA) that provides a voice-first interface for cryptocurrency transactions, specifically designed for visually impaired users, elderly individuals, and Web3 beginners who want an easier way to interact with stablecoins like USDC.

![PayEZ Logo](public/icon-512.png)

## ✨ Features

### 🎙️ Voice Commands
- **"Check balance"** - Get your current wallet balance spoken aloud
- **"Send [X] USDC to [Name/Address]"** - Initiate USDC transfers with voice
- **"Show transaction history"** - Review your recent transactions
- **Real-time voice feedback** - Audio responses for all interactions
- **Error handling** - Clear guidance for unclear or invalid commands

### 🔐 Security & Accessibility
- **MetaMask Integration** - Secure wallet connection via ethers.js
- **High Contrast Design** - Optimized for visual accessibility
- **Large Touch Targets** - Easy interaction for motor accessibility
- **Voice-First Interface** - Primary interaction through speech
- **Biometric Auth Ready** - Framework for fingerprint/face recognition

### 📱 Progressive Web App
- **Installable** - Add to home screen on mobile devices
- **Offline Capable** - Core functionality works without internet
- **Responsive Design** - Optimized for mobile and desktop
- **Fast Loading** - Optimized performance for all devices

### 🌐 Blockchain Support
- **Ethereum Compatible** - Works with all EVM-compatible networks
- **Testnet Ready** - Configured for Polygon Mumbai and Base Goerli
- **USDC Integration** - Specialized for stablecoin transactions
- **Real-time Balance Updates** - Live balance and transaction tracking

## 🎨 Design System

PayEZ features a carefully crafted design system optimized for accessibility:

- **Colors**: Purple primary (#a855f7), bright yellow accents, pure white background
- **Typography**: High contrast, large readable fonts
- **Layout**: Spacious, touch-friendly interface
- **Animations**: Smooth, purposeful transitions
- **Voice States**: Visual indicators for listening, processing, and responding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Modern web browser with speech recognition support

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd payez-voice-wallet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### 🔧 Environment Setup

For production deployment, configure these environment variables:

```env
# Blockchain Network Configuration
VITE_NETWORK_NAME=polygon-mumbai
VITE_RPC_URL=your-rpc-endpoint

# API Keys (store securely)
VITE_SPEECH_API_KEY=your-speech-api-key
```

## 📖 Usage Guide

### Getting Started

1. **Connect Wallet**
   - Click "Connect MetaMask"
   - Approve connection in MetaMask popup
   - Your wallet address and balance will display

2. **Enable Voice Commands**
   - Allow microphone access when prompted
   - Tap the microphone button to start listening
   - Speak clearly and wait for audio confirmation

3. **Voice Command Examples**
   ```
   "Check my balance"
   "What's my balance?"
   "Send 10 USDC to John"
   "Transfer 25 dollars to 0x123..."
   "Show my transaction history"
   "Display recent transactions"
   ```

### Voice Command Patterns

PayEZ understands natural language patterns:

**Balance Commands:**
- "Check balance" / "Show balance"
- "What's my balance?" / "How much money do I have?"
- "Tell me my balance"

**Send Commands:**
- "Send [amount] USDC to [recipient]"
- "Transfer [amount] dollars to [address]"
- "Pay [recipient] [amount] USDC"

**History Commands:**
- "Show transaction history"
- "Display recent transactions"
- "What are my last transactions?"

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server

### Blockchain
- **ethers.js** - Ethereum wallet and contract interaction
- **MetaMask** - Secure wallet connection
- **EVM Compatible** - Works with Ethereum, Polygon, Base, etc.

### Voice & Audio
- **Web Speech API** - Browser-native speech recognition
- **Speech Synthesis API** - Text-to-speech responses
- **Real-time Processing** - Immediate voice feedback

### PWA Features
- **Service Worker** - Offline functionality
- **Web App Manifest** - Installable experience
- **Responsive Design** - Mobile-first approach

## 🏗️ Development

### Project Structure
```
src/
├── components/
│   ├── voice/              # Voice input and command processing
│   ├── wallet/             # Wallet connection and balance display
│   ├── transaction/        # Transaction history and management
│   └── layout/             # App header and navigation
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── pages/                  # Route components
```

### Key Components

- **VoiceInput** - Speech recognition and microphone control
- **VoiceCommandProcessor** - Natural language command parsing
- **WalletConnection** - MetaMask integration and connection
- **BalanceDisplay** - Wallet balance with voice readout
- **TransactionHistory** - Transaction list with voice summary

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Testing Voice Features

1. **Microphone Access**: Ensure browser allows microphone access
2. **Speech Recognition**: Test in Chrome/Edge (best support)
3. **Voice Commands**: Speak clearly and wait for visual feedback
4. **Audio Output**: Verify text-to-speech responses work

## 🚀 Deployment

### PWA Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform** (Vercel, Netlify, etc.)
   - Upload `dist/` folder
   - Configure routing for SPA
   - Enable HTTPS (required for PWA features)

3. **Test PWA features**
   - Install prompt on mobile
   - Offline functionality
   - Voice commands

### Testnet Deployment

PayEZ is configured for testnets:

- **Polygon Mumbai** - Free test MATIC for gas
- **Base Goerli** - Coinbase's L2 testnet
- **Ethereum Goerli** - Main Ethereum testnet

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly** (especially voice features)
5. **Submit a pull request**

### Contribution Guidelines

- **Accessibility First** - Ensure all features work with screen readers
- **Voice Testing** - Test voice commands in different environments
- **Mobile Responsive** - Verify functionality on mobile devices
- **Clean Code** - Follow TypeScript and React best practices

## 🛡️ Security

PayEZ prioritizes security:

- **No Private Key Storage** - Uses MetaMask for key management
- **HTTPS Required** - All production deployments use HTTPS
- **Input Validation** - Validates all voice commands and addresses
- **Testnet First** - Always test on testnets before mainnet

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethereum Foundation** - For the Web3 ecosystem
- **MetaMask** - For secure wallet integration
- **Tailwind CSS** - For the design system
- **React Team** - For the incredible framework
- **Web Speech API** - For making voice interfaces possible

## 📞 Support

- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Check the docs for detailed guides
- **Community** - Join our discussions

---

**PayEZ** - Making crypto accessible for everyone, one voice command at a time. 🎙️✨

*Built with ❤️ for accessibility and inclusion in Web3*