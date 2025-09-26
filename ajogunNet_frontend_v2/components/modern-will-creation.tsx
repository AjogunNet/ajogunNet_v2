
import express from 'express';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { encrypt, decrypt, generateMnemonic } from '../utils/crypto';
import { IWallet } from '../models/wallet.model';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Transaction } from '@mysten/sui/transactions';

dotenv.config();

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// File-based storage for testing
const STORAGE_FILE = path.join(__dirname, '../data/wallets.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Validate wallet data to ensure no undefined or invalid values
const validateWalletData = (wallet: IWallet): boolean => {
  return (
    typeof wallet.userId === 'string' &&
    wallet.userId.trim() !== '' &&
    typeof wallet.address === 'string' &&
    wallet.address.startsWith('0x') &&
    typeof wallet.encryptedPrivateKey === 'string' &&
    typeof wallet.privateKeyIv === 'string' &&
    typeof wallet.encryptedMnemonic === 'string' &&
    typeof wallet.mnemonicIv === 'string' &&
    typeof wallet.salt === 'string' &&
    typeof wallet.isActive === 'boolean' &&
    wallet.createdAt instanceof Date &&
    wallet.updatedAt instanceof Date
  );
};

// Clean corrupted entries from wallets
const cleanWallets = (wallets: Map<string, IWallet>): Map<string, IWallet> => {
  const cleanedWallets = new Map<string, IWallet>();
  wallets.forEach((wallet, userId) => {
    if (validateWalletData(wallet)) {
      cleanedWallets.set(userId, wallet);
    } else {
      console.log(`🧹 Removing corrupted wallet for userId: ${userId}`);
    }
  });
  return cleanedWallets;
};

// File-based storage functions
const readWalletsFromFile = (): Map<string, IWallet> => {
  try {
    ensureDataDir();
    if (!fs.existsSync(STORAGE_FILE)) {
      return new Map<string, IWallet>();
    }
    const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8')) as Record<string, IWallet>;
    const wallets = new Map(Object.entries(data));
    // Convert date strings to Date objects
    wallets.forEach((wallet, userId) => {
      wallet.createdAt = new Date(wallet.createdAt);
      wallet.updatedAt = new Date(wallet.updatedAt);
      wallets.set(userId, wallet);
    });
    // Clean corrupted entries
    return cleanWallets(wallets);
  } catch (error) {
    console.error('Error reading wallets from file:', error);
    return new Map<string, IWallet>();
  }
};

const writeWalletsToFile = (wallets: Map<string, IWallet>) => {
  try {
    ensureDataDir();
    // Clean wallets before writing
    const cleanedWallets = cleanWallets(wallets);
    const data = Object.fromEntries(cleanedWallets);
    // Validate JSON serialization
    const jsonString = JSON.stringify(data, null, 2);
    if (!jsonString || jsonString === '{}') {
      throw new Error('JSON serialization produced empty or invalid output');
    }
    fs.writeFileSync(STORAGE_FILE, jsonString);
    // Verify write by reading back
    const writtenData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    if (Object.keys(writtenData).length !== cleanedWallets.size) {
      throw new Error('Written file does not match expected wallet count');
    }
  } catch (error) {
    console.error('Error writing wallets to file:', error);
    throw new Error(`Failed to save wallet data: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const logWalletState = () => {
  const wallets = readWalletsFromFile();
  console.log("📊 === FILE STORAGE STATE ===");
  console.log(`📊 Total wallets in file: ${wallets.size}`);
  wallets.forEach((wallet, userId) => {
    console.log(`📊 UserId: ${userId}, Address: ${wallet.address}, IsActive: ${wallet.isActive}`);
  });
  console.log("📊 ================================");
};

export const createWallet = async (req: express.Request, res: express.Response) => {
  try {
    console.log("🚀 === WALLET CREATION START ===");
    const { password, userId } = req.body;

    // Input validation
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid or missing userId');
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      throw new Error('Invalid or missing password (must be at least 8 characters)');
    }

    console.log("🚀 Received request data:", { userId, passwordLength: password.length });

    const wallets = readWalletsFromFile();
    if (wallets.has(userId)) {
      console.log(`❌ Wallet already exists for userId: ${userId}`);
      return res.status(409).json({ message: 'Wallet already exists for this userId' });
    }

    const mnemonic = generateMnemonic();
    console.log("🚀 Generated mnemonic:", mnemonic);

    const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
    const publicKey = keypair.getPublicKey().toSuiAddress();
    console.log("🚀 Derived address:", publicKey);

    const secretKeyString = keypair.getSecretKey();
    console.log("🚀 Secret key generated, length:", secretKeyString.length);

    const salt = crypto.randomBytes(16).toString('hex');
    console.log("🚀 Generated salt:", salt);

    const { encrypted: encryptedPrivateKey, iv: privateKeyIv } = encrypt(secretKeyString, password, salt);
    const { encrypted: encryptedMnemonic, iv: mnemonicIv } = encrypt(mnemonic, password, salt);
    console.log("🚀 Encryption completed");

    const walletData: IWallet = {
      userId,
      address: publicKey,
      encryptedPrivateKey,
      privateKeyIv,
      encryptedMnemonic,
      mnemonicIv,
      salt,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate wallet data before storing
    if (!validateWalletData(walletData)) {
      throw new Error('Invalid wallet data generated');
    }

    console.log("🚀 Cleaning existing wallets before storing new wallet for userId:", userId);
    const cleanedWallets = cleanWallets(wallets); // Clean wallets before adding new one
    cleanedWallets.set(userId, walletData);
    console.log("🚀 Storing wallet in file for userId:", userId);
    writeWalletsToFile(cleanedWallets);

    // Verify storage
    const updatedWallets = readWalletsFromFile();
    if (!updatedWallets.has(userId)) {
      throw new Error(`Failed to store wallet for userId: ${userId}`);
    }
    console.log("🚀 Wallet stored and verified in file");

    logWalletState();

    console.log("🚀 === WALLET CREATION SUCCESS ===");
    res.json({
      message: 'Wallet created successfully. Please verify your mnemonic to activate.',
      address: publicKey,
      mnemonic,
      requiresVerification: true
    });
  } catch (err) {
    console.error("💥 Error creating wallet:", err);
    console.log("💥 === WALLET CREATION FAILED ===");
    res.status(500).json({ message: `Error creating wallet: ${err instanceof Error ? err.message : String(err)}` });
  }
};

export const verifyAndActivateWallet = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, mnemonic, password } = req.body;
    console.log("🔍 === WALLET VERIFICATION START ===");
    console.log("🔍 Searching for wallet with userId:", userId);
    console.log("📩 Received data:", { userId, mnemonicLength: mnemonic?.length, passwordLength: password?.length });
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid or missing userId');
    }
    if (!mnemonic || typeof mnemonic !== 'string' || mnemonic.trim().split(/\s+/).length !== 12) {
      throw new Error('Invalid or missing mnemonic (must be 12 words)');
    }
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid or missing password');
    }
    logWalletState();
    const wallets = readWalletsFromFile();
    console.log("🔍 Searching file for userId:", userId);
    const wallet = wallets.get(userId);
    if (!wallet) {
      console.log("❌ No wallet found in file for userId:", userId);
      console.log("📋 Available userIds in file:", Array.from(wallets.keys()));
      return res.status(404).json({
        message: 'Wallet not found. Please create a wallet first.'
      });
    }
    console.log("✅ Found wallet in file:", {
      userId: wallet.userId,
      address: wallet.address,
      isActive: wallet.isActive,
      createdAt: wallet.createdAt
    });
    const normalizedMnemonic = mnemonic.trim().replace(/\s+/g, ' ');
    console.log("🔐 Normalized mnemonic:", JSON.stringify(normalizedMnemonic));
    if (wallet.isActive === true) {
      console.log("ℹ Wallet is already active");
      return res.status(400).json({
        message: 'Wallet is already activated.'
      });
    }
    console.log("🔐 Verifying mnemonic...");
    const keypairFromMnemonic = Ed25519Keypair.deriveKeypair(normalizedMnemonic);
    const derivedAddress = keypairFromMnemonic.getPublicKey().toSuiAddress();
    console.log("📬 Derived address from mnemonic:", derivedAddress);
    console.log("🏦 Stored wallet address:", wallet.address);
    if (derivedAddress !== wallet.address) {
      console.log("❌ Mnemonic verification failed - addresses don't match");
      try {
        const storedMnemonic = decrypt(wallet.encryptedMnemonic, wallet.mnemonicIv, password, wallet.salt);
        console.log("🔍 Stored mnemonic (decrypted):", JSON.stringify(storedMnemonic));
        console.log("🔍 Mnemonic match:", storedMnemonic === normalizedMnemonic);
      } catch (decryptError) {
        console.log("🔍 Could not decrypt stored mnemonic:", decryptError);
      }
      return res.status(400).json({
        message: 'Invalid mnemonic. The mnemonic does not match the wallet address.'
      });
    }
    console.log("✅ Mnemonic verified successfully");
    console.log("🚀 Activating wallet in file...");
    wallet.isActive = true;
    wallet.updatedAt = new Date();
    wallets.set(userId, wallet);
    writeWalletsToFile(wallets);
    console.log("🚀 Wallet updated in file successfully");
    logWalletState();
    console.log("🎉 Wallet activated successfully for userId:", userId);
    console.log("🎉 === WALLET VERIFICATION SUCCESS ===");
    res.json({
      message: 'Wallet activated successfully! Your mnemonic has been verified.',
      address: wallet.address,
      activated: true
    });
  } catch (err) {
    console.error("💥 Error activating wallet:", err);
    console.log("💥 === WALLET VERIFICATION FAILED ===");
    res.status(500).json({ message: `Error activating wallet: ${err instanceof Error ? err.message : String(err)}` });
  }
};

export const importWallet = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, mnemonic, password } = req.body;
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid or missing userId');
    }
    if (!mnemonic || typeof mnemonic !== 'string' || mnemonic.trim().split(/\s+/).length !== 12) {
      throw new Error('Invalid or missing mnemonic (must be 12 words)');
    }
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid or missing password');
    }
    const wallets = readWalletsFromFile();
    if (wallets.has(userId)) {
      return res.status(400).json({
        message: 'Wallet already exists for this user.'
      });
    }
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
    const publicKey = keypair.getPublicKey().toSuiAddress();
    const salt = crypto.randomBytes(16).toString('hex');
    const { encrypted: encryptedPrivateKey, iv: privateKeyIv } = encrypt(keypair.getSecretKey(), password, salt);
    const { encrypted: encryptedMnemonic, iv: mnemonicIv } = encrypt(mnemonic, password, salt);
    const walletData: IWallet = {
      userId,
      address: publicKey,
      encryptedPrivateKey,
      privateKeyIv,
      encryptedMnemonic,
      mnemonicIv,
      salt,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (!validateWalletData(walletData)) {
      throw new Error('Invalid wallet data generated');
    }
    wallets.set(userId, walletData);
    writeWalletsToFile(wallets);
    res.json({
      message: 'Wallet imported and activated successfully!',
      address: publicKey,
      activated: true
    });
  } catch (err) {
    console.error("Error importing wallet:", err);
    res.status(500).json({ message: `Error importing wallet: ${err instanceof Error ? err.message : String(err)}` });
  }
};

export const getBalance = async (req: express.Request, res: express.Response) => {
  try {
    console.log("💰 === BALANCE FETCH START ===");
    const { userId } = req.params;
    console.log("💰 Fetching balance for userId:", userId);
    logWalletState();
    const wallets = readWalletsFromFile();
    console.log("🔍 Searching file for userId:", userId);
    const wallet = wallets.get(userId);
    if (!wallet) {
      console.log("💰 ❌ No wallet found in file for userId:", userId);
      return res.status(404).json({
        message: 'Wallet not found or not activated. Please verify your mnemonic first.'
      });
    }
    if (!wallet.isActive) {
      console.log("💰 ❌ Wallet found but not activated for userId:", userId);
      return res.status(404).json({
        message: 'Wallet not found or not activated. Please verify your mnemonic first.'
      });
    }
    console.log("💰 ✅ Found active wallet, fetching balance from blockchain...");
    const balance = await client.getBalance({ owner: wallet.address });
    console.log("💰 ✅ Balance fetched successfully:", balance.totalBalance);
    console.log("💰 === BALANCE FETCH SUCCESS ===");
    return res.status(200).json({
      address: wallet.address,
      balance: balance.totalBalance,
      message: 'Balance fetched successfully',
    });
  } catch (error) {
    console.error('💰 💥 Balance fetch failed:', error);
    console.log("💰 === BALANCE FETCH FAILED ===");
    res.status(500).json({ message: 'Error fetching balance' });
  }
};

export const transferTokens = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const { recipient, amount, password } = req.body;
    const wallets = readWalletsFromFile();
    const wallet = wallets.get(userId);
    if (!wallet || !wallet.isActive) {
      return res.status(404).json({
        message: "Wallet not found or not activated. Please verify your mnemonic first."
      });
    }
    try {
      const privateKeyString = decrypt(wallet.encryptedPrivateKey, wallet.privateKeyIv, password, wallet.salt);
      console.log("Decrypted private key string:", privateKeyString);
      console.log("Decrypted key type:", typeof privateKeyString);
      console.log("Decrypted key length:", privateKeyString.length);
      const keypair = Ed25519Keypair.fromSecretKey(privateKeyString);
      const derivedAddress = keypair.getPublicKey().toSuiAddress();
      if (derivedAddress !== wallet.address) {
        return res.status(401).json({ message: "Key derivation error: addresses don't match" });
      }
      const balance = await client.getBalance({ owner: wallet.address });
      const amountNum = parseInt(amount);
      if (parseInt(balance.totalBalance) < amountNum) {
        return res.status(400).json({
          message: `Insufficient balance. Available: ${balance.totalBalance} MIST, Required: ${amountNum} MIST`
        });
      }
      const tx = new Transaction();
      const [coinToTransfer] = tx.splitCoins(tx.gas, [amountNum]);
      tx.transferObjects([coinToTransfer], recipient);
      tx.setGasBudget(10000000);
      const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
      });
      res.json({
        message: "Transfer successful",
        transactionDigest: result.digest,
        from: wallet.address,
        to: recipient,
        amount: amountNum,
      });
    } catch (decryptionError) {
      console.error("Decryption failed:", decryptionError);
      return res.status(401).json({ message: "Invalid password or decryption error" });
    }
  } catch (err) {
    console.error("Token transfer failed:", err);
    res.status(500).json({ message: `Error transferring tokens: ${err instanceof Error ? err.message : String(err)}` });
  }
};

export const getWallet = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: 'Missing userId or password' });
    }
    const wallets = readWalletsFromFile();
    const wallet = wallets.get(userId);
    if (!wallet || !wallet.isActive) {
      return res.status(404).json({ message: 'Wallet not found or not activated' });
    }
    let mnemonic = null;
    if (req.query.includeMnemonic === 'true') {
      try {
        mnemonic = decrypt(wallet.encryptedMnemonic, wallet.mnemonicIv, password, wallet.salt);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }
    return res.status(200).json({
      address: wallet.address,
      mnemonic,
      message: 'Wallet fetched successfully',
    });
  } catch (error) {
    console.error('Wallet fetch failed:', error);
    return res.status(500).json({ message: 'Error fetching wallet' });
  }
};

export const getWalletStatus = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const wallets = readWalletsFromFile();
    const wallet = wallets.get(userId);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    const isActive = wallet.isActive;
    return res.status(200).json({
      address: wallet.address,
      isActive: isActive || false,
      message: 'Wallet status fetched successfully',
    });
  } catch (error) {
    console.error('Wallet status fetch failed:', error);
    return res.status(500).json({ message: 'Error fetching wallet status' });
  }
};

export const activateWalletAlternative = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, mnemonic, password } = req.body;
    const wallets = readWalletsFromFile();
    const wallet = wallets.get(userId);
    if (!wallet || wallet.isActive) {
      return res.status(404).json({
        message: 'Wallet not found or already activated.'
      });
    }
    const keypairFromMnemonic = Ed25519Keypair.deriveKeypair(mnemonic);
    const derivedAddress = keypairFromMnemonic.getPublicKey().toSuiAddress();
    if (derivedAddress !== wallet.address) {
      return res.status(400).json({
        message: 'Invalid mnemonic.'
      });
    }
    wallet.isActive = true;
    wallets.set(userId, wallet);
    writeWalletsToFile(wallets);
    res.json({
      message: 'Wallet activated successfully!',
      address: wallet.address,
      activated: true
    });
  } catch (err) {
    console.error("Error activating wallet:", err);
    res.status(500).json({ message: `Error activating wallet: ${err instanceof Error ? err.message : String(err)}` });
  }
};

export const migrateWallets = async () => {
  try {
    const wallets = readWalletsFromFile();
    let modifiedCount = 0;
    wallets.forEach((wallet, userId) => {
      if (wallet.isActive === undefined) {
        wallet.isActive = false;
        wallets.set(userId, wallet);
        modifiedCount++;
      }
    });
    writeWalletsToFile(wallets);
    console.log(`✅ Migrated ${modifiedCount} wallets to include isActive field`);
  } catch (error) {
    console.error('❌ Wallet migration failed:', error);
  }
};

export const exportToSuiCLI = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, password } = req.body;
    const wallets = readWalletsFromFile();
    const wallet = wallets.get(userId);
    if (!wallet || !wallet.isActive) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    const mnemonic = decrypt(wallet.encryptedMnemonic, wallet.mnemonicIv, password, wallet.salt);
    res.json({
      message: 'Use this mnemonic to import into Sui CLI:',
      mnemonic: mnemonic,
      suiCLICommand: `sui keytool import "${mnemonic}" ed25519`
    });
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ message: 'Error exporting wallet' });
  }
};


// "use client"

// import { useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { useWallet } from "@/lib/wallet-context"
// import { useApi } from "@/hooks/use-api"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Home,
//   FileText,
//   Users,
//   Wallet,
//   MessageSquare,
//   Bot,
//   Menu,
//   X,
//   Bell,
//   Settings,
//   LogOut,
//   ChevronDown,
//   Plus,
//   Trash2,
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle,
//   Shield,
// } from "lucide-react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"

// interface Beneficiary {
//   id: string
//   name: string
//   relationship: string
//   walletAddress: string
//   percentage: number
//   status: 'verified' | 'pending'
// }

// const ModernWillCreation = () => {
//   const router = useRouter()
//   const { userId, password, isAuthenticated, logout } = useWallet()
//   const { address, refreshBalanceFast } = useWallet()
//   const { createWill, createWillState } = useApi()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [profileOpen, setProfileOpen] = useState(false)
  
//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
//     {
//       id: "1",
//       name: "Sarah Johnson",
//       relationship: "Daughter",
//       walletAddress: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
//       percentage: 40,
//       status: "verified",
//     },
//     {
//       id: "2",
//       name: "Michael Johnson",
//       relationship: "Son",
//       walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
//       percentage: 35,
//       status: "verified",
//     },
//     {
//       id: "3",
//       name: "Red Cross Foundation",
//       relationship: "Charity",
//       walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
//       percentage: 25,
//       status: "pending",
//     },
//   ])

//   const [willAmount, setWillAmount] = useState("1000")

//   const sidebarLinks = [
//     { name: "Dashboard", icon: Home, href: "/dashboard" },
//     { name: "Create Will", icon: FileText, href: "/create", active: true },
//     { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
//     { name: "Wallet", icon: Wallet, href: "/wallet" },
//     { name: "Messages", icon: MessageSquare, href: "/messages" },
//     { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
//   ]

//   const steps = [
//     { id: 1, title: "Beneficiaries", description: "Add recipients", icon: Users },
//     { id: 2, title: "Assets", description: "Select digital assets", icon: Wallet },
//     { id: 3, title: "Review & Deploy", description: "Finalize and deploy", icon: Shield },
//   ]

//   const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)

//   const addBeneficiary = () => {
//     const newBeneficiary: Beneficiary = {
//       id: Date.now().toString(),
//       name: "",
//       relationship: "",
//       walletAddress: "",
//       percentage: 0,
//       status: "pending",
//     }
//     setBeneficiaries([...beneficiaries, newBeneficiary])
//   }

//   const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
//     setBeneficiaries(beneficiaries.map(b => 
//       b.id === id ? { ...b, [field]: value } : b
//     ))
//   }

//   const removeBeneficiary = (id: string) => {
//     setBeneficiaries(beneficiaries.filter(b => b.id !== id))
//   }

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const handleDeploy = async () => {
//         const finalUserId = localStorage.getItem("ajogun-userId") || localStorage.getItem("walletUserId")
//         const finalPassword = localStorage.getItem("ajogun-password")
//         console.log("userid and password", finalUserId, finalPassword);

//     try {
      
//       // Transform willData to API format
//       const apiWillData = {
//         userId:finalUserId,
//         password:finalPassword,
//         heirs: beneficiaries.map(b => b.walletAddress).filter(addr => addr.trim() !== ''),
//         shares: beneficiaries.map(b => b.percentage * 100),
//       }

//       console.log('Creating will with data:', apiWillData)
//       console.log('Creating will with data:', apiWillData.userId)

//       const result = await createWill(apiWillData)
      
//       if (result && result.success) {
//         // Handle successful deployment
//         console.log("🎉 === WILL CREATION SUCCESS ===")
//         console.log(`✅ Will Index: ${result.willIndex}`)
//         console.log(`✅ Contract Address: ${result.contractAddress}`)
//         console.log(`✅ Transaction Hash: ${result.transactionHash}`)
//         console.log(`✅ Created At: ${new Date().toISOString()}`)
//         console.log("==================================")
        
//         // Refresh balance immediately after will creation
//         await refreshBalanceFast()
        
//         // Show success message
//         alert(`🎉 Will Created Successfully!\n\nWill Index: ${result.willIndex}\nContract: ${result.contractAddress}\nTransaction: ${result.transactionHash}`)
        
//         // Navigate to dashboard to show the created will
//         router.push("/dashboard")
//       } else {
//         console.error('Will creation failed:', result?.message)
//         alert(`❌ Will Creation Failed: ${result?.message || 'Unknown error'}`)
//       }
//     } catch (error) {
//       console.error('Deployment failed:', error)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between h-16 px-6 border-b border-border">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//               </svg>
//             </div>
//             <span className="text-xl font-bold text-foreground">AjogunNet</span>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-muted">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <nav className="px-4 py-6 space-y-2">
//           {sidebarLinks.map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
//                 link.active
//                   ? "bg-primary text-primary-foreground shadow-lg"
//                   : "text-muted-foreground hover:bg-muted hover:text-foreground"
//               }`}
//             >
//               <link.icon className={`w-5 h-5 mr-3 ${link.active ? "text-primary-foreground" : ""}`} />
//               {link.name}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="lg:ml-64">
//         {/* Header */}
//         <header className="bg-card shadow-sm border-b border-border">
//           <div className="flex items-center justify-between h-16 px-6">
//             <div className="flex items-center space-x-4">
//               <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-muted">
//                 <Menu className="w-5 h-5" />
//               </button>
//               <div>
//                 <h1 className="text-xl font-semibold text-foreground">Create Your Digital Will</h1>
//                 <p className="text-sm text-muted-foreground">Follow the steps below to create and deploy your will on the blockchain</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
//                 <Bell className="w-5 h-5" />
//               </button>

//               <div className="relative">
//                 <button
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted transition-colors"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
//                     <span className="text-white text-sm font-medium">{userId?.charAt(0).toUpperCase()}</span>
//                   </div>
//                   <ChevronDown className="w-4 h-4 text-muted-foreground" />
//                 </button>

//                 {profileOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
//                     <button className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">
//                       <Settings className="inline w-4 h-4 mr-2" />
//                       Settings
//                     </button>
//                     <button 
//                       onClick={logout}
//                       className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
//                     >
//                       <LogOut className="inline w-4 h-4 mr-2" />
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard content */}
//         <main className="p-6">
//           {/* Step Indicator */}
//           <div className="mb-8">
//             <div className="flex items-center justify-center space-x-8">
//               {steps.map((step, index) => (
//                 <div key={step.id} className="flex items-center">
//                   <div className="flex flex-col items-center">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                         currentStep >= step.id
//                           ? "bg-primary text-white"
//                           : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       <step.icon className="w-6 h-6" />
//                     </div>
//                     <div className="mt-2 text-center">
//                       <p className="text-sm font-medium text-foreground">{step.title}</p>
//                       <p className="text-xs text-muted-foreground">{step.description}</p>
//                     </div>
//                   </div>
//                   {index < steps.length - 1 && (
//                     <div className={`w-24 h-1 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Step Content */}
//           {currentStep === 1 && (
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-xl font-semibold text-foreground">Add Beneficiaries</h2>
//                     <p className="text-muted-foreground">Specify who will inherit your digital assets</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-primary">{totalPercentage}%</div>
//                     <div className="text-sm text-muted-foreground">Total Allocation</div>
//                   </div>
//                 </div>

//                 <div className="space-y-4 mb-6">
//                   {beneficiaries.map((beneficiary) => (
//                     <div key={beneficiary.id} className="p-4 border border-border rounded-xl">
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div>
//                           <Label htmlFor={`name-${beneficiary.id}`}>Name</Label>
//                           <Input
//                             id={`name-${beneficiary.id}`}
//                             value={beneficiary.name}
//                             onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
//                             placeholder="Beneficiary name"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor={`relationship-${beneficiary.id}`}>Relationship</Label>
//                           <Input
//                             id={`relationship-${beneficiary.id}`}
//                             value={beneficiary.relationship}
//                             onChange={(e) => updateBeneficiary(beneficiary.id, 'relationship', e.target.value)}
//                             placeholder="e.g., Daughter, Son"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor={`address-${beneficiary.id}`}>Wallet Address</Label>
//                           <Input
//                             id={`address-${beneficiary.id}`}
//                             value={beneficiary.walletAddress}
//                             onChange={(e) => updateBeneficiary(beneficiary.id, 'walletAddress', e.target.value)}
//                             placeholder="0x..."
//                           />
//                         </div>
//                         <div className="flex items-end space-x-2">
//                           <div className="flex-1">
//                             <Label htmlFor={`percentage-${beneficiary.id}`}>Percentage</Label>
//                             <Input
//                               id={`percentage-${beneficiary.id}`}
//                               type="number"
//                               value={beneficiary.percentage}
//                               onChange={(e) => updateBeneficiary(beneficiary.id, 'percentage', parseInt(e.target.value) || 0)}
//                               placeholder="0"
//                               min="0"
//                               max="100"
//                             />
//                           </div>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => removeBeneficiary(beneficiary.id)}
//                             className="text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <Button onClick={addBeneficiary} variant="outline" className="w-full mb-6">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add New Beneficiary
//                 </Button>

//                 {totalPercentage !== 100 && (
//                   <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-6">
//                     <p className="text-sm text-yellow-800 dark:text-yellow-200">
//                       <strong>Note:</strong> Total allocation must equal 100%. Currently: {totalPercentage}%
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <Button variant="outline" disabled>
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Previous
//                   </Button>
//                   <Button onClick={handleNext} disabled={totalPercentage !== 100}>
//                     Next: Select Assets
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {currentStep === 2 && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold text-foreground mb-4">Select Digital Assets</h2>
//                 <p className="text-muted-foreground mb-6">Specify the amount to include in your will</p>

//                 <div className="space-y-4 mb-6">
//                   <div>
//                     <Label htmlFor="amount">Amount (SUI)</Label>
//                     <Input
//                       id="amount"
//                       type="number"
//                       value={willAmount}
//                       onChange={(e) => setWillAmount(e.target.value)}
//                       placeholder="Enter amount"
//                       min="0"
//                       step="0.01"
//                     />
//                     <p className="text-sm text-muted-foreground mt-1">
//                       This amount will be distributed among your beneficiaries according to their percentages
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={handlePrevious}>
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Previous
//                   </Button>
//                   <Button onClick={handleNext}>
//                     Next: Review & Deploy
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {currentStep === 3 && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold text-foreground mb-6">Review Your Will</h2>

//                 <div className="space-y-6 mb-6">
//                   <div>
//                     <h3 className="font-medium text-foreground mb-3">Beneficiaries ({beneficiaries.length})</h3>
//                     <div className="space-y-2">
//                       {beneficiaries.map((beneficiary) => (
//                         <div key={beneficiary.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//                           <span className="text-sm">{beneficiary.name} ({beneficiary.relationship})</span>
//                           <span className="font-medium text-primary">{beneficiary.percentage}%</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="font-medium text-foreground mb-3">Total Amount</h3>
//                     <div className="p-3 bg-muted/30 rounded-lg">
//                       <span className="text-lg font-semibold">{willAmount} SUI</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
//                   <div className="flex items-start space-x-3">
//                     <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Security & Privacy</h3>
//                       <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
//                         <li>• Your will is secured on the Sui blockchain</li>
//                         <li>• Smart contract ensures automatic execution</li>
//                         <li>• Only beneficiaries can access after execution</li>
//                         <li>• Immutable and tamper-proof storage</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Terms and Conditions */}
//                 <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-4">
//                     <div className="flex items-start space-x-3">
//                       <input 
//                         type="checkbox" 
//                         id="terms" 
//                         className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         required
//                       />
//                       <div>
//                         <label htmlFor="terms" className="text-sm font-medium text-foreground cursor-pointer">
//                           I agree to the Terms and Conditions
//                         </label>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           By creating this will, I understand that:
//                         </p>
//                         <ul className="text-xs text-muted-foreground mt-2 space-y-1">
//                           <li>• This will is legally binding once deployed to the blockchain</li>
//                           <li>• I am responsible for keeping my credentials secure</li>
//                           <li>• The smart contract will execute automatically based on set conditions</li>
//                           <li>• I can revoke or modify this will at any time before execution</li>
//                         </ul>
//                         <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
//                           Read full Terms and Conditions
//                         </button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={handlePrevious}>
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Previous
//                   </Button>
//                   <Button onClick={handleDeploy} disabled={createWillState.loading} className="bg-blue-600 hover:bg-blue-700">
//                     {createWillState.loading ? (
//                       <>
//                         <div className="animate-spin w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full"></div>
//                         Deploying to Blockchain...
//                       </>
//                     ) : (
//                       <>
//                         <Shield className="w-4 h-4 mr-2" />
//                         Deploy Will to Blockchain
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }

// export default ModernWillCreation

// "use client"

// import { useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { useWallet } from "@/lib/wallet-context"
// import { useApi } from "@/hooks/use-api"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Home,
//   FileText,
//   Users,
//   Wallet,
//   MessageSquare,
//   Bot,
//   Menu,
//   X,
//   Bell,
//   Settings,
//   LogOut,
//   ChevronDown,
//   Plus,
//   Trash2,
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle,
//   Shield,
// } from "lucide-react"
// import Link from "next/link"

// interface Beneficiary {
//   id: string
//   name: string
//   relationship: string
//   walletAddress: string
//   percentage: number
//   status: 'verified' | 'pending'
// }

// const ModernWillCreation = () => {
//   const { userId, password, isAuthenticated, logout } = useAuth()
//   const { address, refreshBalanceFast } = useWallet()
//   const { createWill, createWillState } = useApi()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [profileOpen, setProfileOpen] = useState(false)
  
//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
//     {
//       id: "1",
//       name: "Sarah Johnson",
//       relationship: "Daughter",
//       walletAddress: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
//       percentage: 40,
//       status: "verified",
//     },
//     {
//       id: "2",
//       name: "Michael Johnson",
//       relationship: "Son",
//       walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
//       percentage: 35,
//       status: "verified",
//     },
//     {
//       id: "3",
//       name: "Red Cross Foundation",
//       relationship: "Charity",
//       walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
//       percentage: 25,
//       status: "pending",
//     },
//   ])

//   const [willAmount, setWillAmount] = useState("1000")

//   const sidebarLinks = [
//     { name: "Dashboard", icon: Home, href: "/dashboard" },
//     { name: "Create Will", icon: FileText, href: "/create", active: true },
//     { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
//     { name: "Wallet", icon: Wallet, href: "/wallet" },
//     { name: "Messages", icon: MessageSquare, href: "/messages" },
//     { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
//   ]

//   const steps = [
//     { id: 1, title: "Beneficiaries", description: "Add recipients", icon: Users },
//     { id: 2, title: "Assets", description: "Select digital assets", icon: Wallet },
//     { id: 3, title: "Review & Deploy", description: "Finalize and deploy", icon: Shield },
//   ]

//   const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)

//   const addBeneficiary = () => {
//     const newBeneficiary: Beneficiary = {
//       id: Date.now().toString(),
//       name: "",
//       relationship: "",
//       walletAddress: "",
//       percentage: 0,
//       status: "pending",
//     }
//     setBeneficiaries([...beneficiaries, newBeneficiary])
//   }

//   const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
//     setBeneficiaries(beneficiaries.map(b => 
//       b.id === id ? { ...b, [field]: value } : b
//     ))
//   }

//   const removeBeneficiary = (id: string) => {
//     setBeneficiaries(beneficiaries.filter(b => b.id !== id))
//   }

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const handleDeploy = async () => {
//     if (!isAuthenticated || !userId || !password) {
//       alert('Please login first')
//       return
//     }

//     try {
//       // Transform willData to API format
//       const apiWillData = {
//         userId,
//         password,
//         heirs: beneficiaries.map(b => b.walletAddress).filter(addr => addr.trim() !== ''),
//         shares: beneficiaries.map(b => b.percentage * 100),
//       }

//       console.log('Creating will with data:', apiWillData)

//       const result = await createWill(apiWillData)
      
//       if (result && result.success) {
//         // Handle successful deployment
//         console.log("🎉 === WILL CREATION SUCCESS ===")
//         console.log(`✅ Will Index: ${result.willIndex}`)
//         console.log(`✅ Contract Address: ${result.contractAddress}`)
//         console.log(`✅ Transaction Hash: ${result.transactionHash}`)
//         console.log(`✅ Created At: ${new Date().toISOString()}`)
//         console.log("==================================")
        
//         // Refresh balance immediately after will creation
//         await refreshBalanceFast()
        
//         // Show success message
//         alert(`🎉 Will Created Successfully!\n\nWill Index: ${result.willIndex}\nContract: ${result.contractAddress}\nTransaction: ${result.transactionHash}`)
        
//         // Navigate to dashboard to show the created will
//         window.location.href = "/dashboard"
//       } else {
//         console.error('Will creation failed:', result?.message)
//         alert(`❌ Will Creation Failed: ${result?.message || 'Unknown error'}`)
//       }
//     } catch (error) {
//       console.error('Deployment failed:', error)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between h-16 px-6 border-b border-border">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//               </svg>
//             </div>
//             <span className="text-xl font-bold text-foreground">AjogunNet</span>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-muted">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <nav className="px-4 py-6 space-y-2">
//           {sidebarLinks.map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
//                 link.active
//                   ? "bg-primary text-primary-foreground shadow-lg"
//                   : "text-muted-foreground hover:bg-muted hover:text-foreground"
//               }`}
//             >
//               <link.icon className={`w-5 h-5 mr-3 ${link.active ? "text-primary-foreground" : ""}`} />
//               {link.name}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="lg:ml-64">
//         {/* Header */}
//         <header className="bg-card shadow-sm border-b border-border">
//           <div className="flex items-center justify-between h-16 px-6">
//             <div className="flex items-center space-x-4">
//               <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-muted">
//                 <Menu className="w-5 h-5" />
//               </button>
//               <div>
//                 <h1 className="text-xl font-semibold text-foreground">Create Your Digital Will</h1>
//                 <p className="text-sm text-muted-foreground">Follow the steps below to create and deploy your will on the blockchain</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
//                 <Bell className="w-5 h-5" />
//               </button>

//               <div className="relative">
//                 <button
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted transition-colors"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
//                     <span className="text-white text-sm font-medium">{userId?.charAt(0).toUpperCase()}</span>
//                   </div>
//                   <ChevronDown className="w-4 h-4 text-muted-foreground" />
//                 </button>

//                 {profileOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
//                     <button className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">
//                       <Settings className="inline w-4 h-4 mr-2" />
//                       Settings
//                     </button>
//                     <button 
//                       onClick={logout}
//                       className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
//                     >
//                       <LogOut className="inline w-4 h-4 mr-2" />
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard content */}
//         <main className="p-6">
//           {/* Step Indicator */}
//           <div className="mb-8">
//             <div className="flex items-center justify-center space-x-8">
//               {steps.map((step, index) => (
//                 <div key={step.id} className="flex items-center">
//                   <div className="flex flex-col items-center">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                         currentStep >= step.id
//                           ? "bg-primary text-white"
//                           : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       <step.icon className="w-6 h-6" />
//                     </div>
//                     <div className="mt-2 text-center">
//                       <p className="text-sm font-medium text-foreground">{step.title}</p>
//                       <p className="text-xs text-muted-foreground">{step.description}</p>
//                     </div>
//                   </div>
//                   {index < steps.length - 1 && (
//                     <div className={`w-24 h-1 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Step Content */}
//           {currentStep === 1 && (
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-xl font-semibold text-foreground">Add Beneficiaries</h2>
//                     <p className="text-muted-foreground">Specify who will inherit your digital assets</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-primary">{totalPercentage}%</div>
//                     <div className="text-sm text-muted-foreground">Total Allocation</div>
//                   </div>
//                 </div>

//                 <div className="space-y-4 mb-6">
//                   {beneficiaries.map((beneficiary) => (
//                     <div key={beneficiary.id} className="p-4 border border-border rounded-xl">
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div>
//                           <Label htmlFor={`name-${beneficiary.id}`}>Name</Label>
//                           <Input
//                             id={`name-${beneficiary.id}`}
//                             value={beneficiary.name}
//                             onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
//                             placeholder="Beneficiary name"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor={`relationship-${beneficiary.id}`}>Relationship</Label>
//                           <Input
//                             id={`relationship-${beneficiary.id}`}
//                             value={beneficiary.relationship}
//                             onChange={(e) => updateBeneficiary(beneficiary.id, 'relationship', e.target.value)}
//                             placeholder="e.g., Daughter, Son"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor={`address-${beneficiary.id}`}>Wallet Address</Label>
//                           <Input
//                             id={`address-${beneficiary.id}`}
//                             value={beneficiary.walletAddress}
//                             onChange={(e) => updateBeneficiary(beneficiary.id, 'walletAddress', e.target.value)}
//                             placeholder="0x..."
//                           />
//                         </div>
//                         <div className="flex items-end space-x-2">
//                           <div className="flex-1">
//                             <Label htmlFor={`percentage-${beneficiary.id}`}>Percentage</Label>
//                             <Input
//                               id={`percentage-${beneficiary.id}`}
//                               type="number"
//                               value={beneficiary.percentage}
//                               onChange={(e) => updateBeneficiary(beneficiary.id, 'percentage', parseInt(e.target.value) || 0)}
//                               placeholder="0"
//                               min="0"
//                               max="100"
//                             />
//                           </div>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => removeBeneficiary(beneficiary.id)}
//                             className="text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <Button onClick={addBeneficiary} variant="outline" className="w-full mb-6">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add New Beneficiary
//                 </Button>

//                 {totalPercentage !== 100 && (
//                   <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-6">
//                     <p className="text-sm text-yellow-800 dark:text-yellow-200">
//                       <strong>Note:</strong> Total allocation must equal 100%. Currently: {totalPercentage}%
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <Button variant="outline" disabled>
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Previous
//                   </Button>
//                   <Button onClick={handleNext} disabled={totalPercentage !== 100}>
//                     Next: Select Assets
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {currentStep === 2 && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold text-foreground mb-4">Select Digital Assets</h2>
//                 <p className="text-muted-foreground mb-6">Specify the amount to include in your will</p>

//                 <div className="space-y-4 mb-6">
//                   <div>
//                     <Label htmlFor="amount">Amount (SUI)</Label>
//                     <Input
//                       id="amount"
//                       type="number"
//                       value={willAmount}
//                       onChange={(e) => setWillAmount(e.target.value)}
//                       placeholder="Enter amount"
//                       min="0"
//                       step="0.01"
//                     />
//                     <p className="text-sm text-muted-foreground mt-1">
//                       This amount will be distributed among your beneficiaries according to their percentages
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={handlePrevious}>
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Previous
//                   </Button>
//                   <Button onClick={handleNext}>
//                     Next: Review & Deploy
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {currentStep === 3 && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold text-foreground mb-6">Review Your Will</h2>

//                 <div className="space-y-6 mb-6">
//                   <div>
//                     <h3 className="font-medium text-foreground mb-3">Beneficiaries ({beneficiaries.length})</h3>
//                     <div className="space-y-2">
//                       {beneficiaries.map((beneficiary) => (
//                         <div key={beneficiary.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//                           <span className="text-sm">{beneficiary.name} ({beneficiary.relationship})</span>
//                           <span className="font-medium text-primary">{beneficiary.percentage}%</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="font-medium text-foreground mb-3">Total Amount</h3>
//                     <div className="p-3 bg-muted/30 rounded-lg">
//                       <span className="text-lg font-semibold">{willAmount} SUI</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
//                   <div className="flex items-start space-x-3">
//                     <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Security & Privacy</h3>
//                       <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
//                         <li>• Your will is secured on the Sui blockchain</li>
//                         <li>• Smart contract ensures automatic execution</li>
//                         <li>• Only beneficiaries can access after execution</li>
//                         <li>• Immutable and tamper-proof storage</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Terms and Conditions */}
//                 <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-4">
//                     <div className="flex items-start space-x-3">
//                       <input 
//                         type="checkbox" 
//                         id="terms" 
//                         className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         required
//                       />
//                       <div>
//                         <label htmlFor="terms" className="text-sm font-medium text-foreground cursor-pointer">
//                           I agree to the Terms and Conditions
//                         </label>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           By creating this will, I understand that:
//                         </p>
//                         <ul className="text-xs text-muted-foreground mt-2 space-y-1">
//                           <li>• This will is legally binding once deployed to the blockchain</li>
//                           <li>• I am responsible for keeping my credentials secure</li>
//                           <li>• The smart contract will execute automatically based on set conditions</li>
//                           <li>• I can revoke or modify this will at any time before execution</li>
//                         </ul>
//                         <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
//                           Read full Terms and Conditions
//                         </button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={handlePrevious}>
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Previous
//                   </Button>
//                   <Button onClick={handleDeploy} disabled={createWillState.loading} className="bg-blue-600 hover:bg-blue-700">
//                     {createWillState.loading ? (
//                       <>
//                         <div className="animate-spin w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full"></div>
//                         Deploying to Blockchain...
//                       </>
//                     ) : (
//                       <>
//                         <Shield className="w-4 h-4 mr-2" />
//                         Deploy Will to Blockchain
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }

// export default ModernWillCreation