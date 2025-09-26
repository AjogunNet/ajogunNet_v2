"use client"

import { useState } from "react"
import StepIndicator from "@/components/step-indicator"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/use-api"
import { useWallet } from "@/lib/wallet-context"
import { useAuth } from "@/lib/auth-context"
import {
  Shield,
  Wallet,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface WillData {
  beneficiaries: any[]
  assets: any[]
  messages: any[]
  executionConditions: {
    deadManSwitch: boolean
    inactivityPeriod: number
    backupExecutors: string[]
  }
  metadata: {
    title: string
    description: string
    createdAt: string
    lastModified: string
  }
}

const WillCreationFlow = () => {
  const router = useRouter()
  const { createWill, createWillState } = useApi()
  const { address } = useWallet()
  const { userId, password, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [willData, setWillData] = useState<WillData>({
    beneficiaries: [],
    assets: [],
    messages: [],
    executionConditions: {
      deadManSwitch: true,
      inactivityPeriod: 365,
      backupExecutors: [],
    },
    metadata: {
      title: "My Digital Will",
      description: "",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    },
  })
  const [deploymentComplete, setDeploymentComplete] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<any>(null)

  const steps = [
    {
      id: 1,
      title: "Beneficiaries",
      description: "Add recipients",
      component: BeneficiaryStep,
    },
    {
      id: 2,
      title: "Assets",
      description: "Select digital assets",
      component: AssetStep,
    },
    {
      id: 3,
      title: "Review & Deploy",
      description: "Finalize and deploy",
      component: ReviewStep,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDeploy = async () => {
    // if (!userId || !password) {
    //   alert('Please login first')
    //   return
    // }

    try {
      // Transform willData to API format
      const apiWillData = {
        userId,
        password,
        heirs: willData.beneficiaries.map(b => b.walletAddress),
        shares: willData.beneficiaries.map(b => Number(b.percentage) * 100),
      }


      const result = await createWill(apiWillData)
      
      if (result && result.success) {
        console.log("🎉 === WILL CREATION SUCCESS ===")
        console.log(`✅ Will Index: ${result.willIndex}`)
        console.log(`✅ Contract Address: ${result.contractAddress}`)
        console.log(`✅ Transaction Hash: ${result.transactionHash}`)
        console.log("==================================")
        
        setDeploymentResult(result)
        setDeploymentComplete(true)
        setCompletedSteps([...completedSteps, currentStep])
        
        // Show success message and navigate
        alert(`🎉 Will Created Successfully!\n\nWill Index: ${result.willIndex}\nContract: ${result.contractAddress}`)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        console.error('Will creation failed:', result?.message)
        alert(`❌ Will Creation Failed: ${result?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Deployment failed:', error)
    }
  }

  const CurrentStepComponent = steps[currentStep - 1]?.component

  if (deploymentComplete) {
    return <DeploymentSuccess willData={willData} deploymentResult={deploymentResult} />
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Digital Will</h1>
        <p className="text-muted-foreground">Follow the steps below to create and deploy your will on the blockchain</p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {CurrentStepComponent && (
          <CurrentStepComponent
            willData={willData}
            setWillData={setWillData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isDeploying={createWillState.loading}
            onDeploy={handleDeploy}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        )}
      </div>
    </div>
  )
}

const BeneficiaryStep = ({ willData, setWillData, onNext, currentStep, totalSteps }) => {
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Daughter",
      email: "sarah.johnson@email.com",
      walletAddress: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
      percentage: 40,
      status: "verified",
      type: "individual",
    },
    {
      id: "2",
      name: "Michael Johnson",
      relationship: "Son",
      email: "michael.johnson@email.com",
      walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
      percentage: 35,
      status: "verified",
      type: "individual",
    },
    {
      id: "3",
      name: "Red Cross Foundation",
      relationship: "Charity",
      email: "donations@redcross.org",
      walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
      percentage: 25,
      status: "pending",
      type: "organization",
    },
  ])

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)
  const canProceed = totalPercentage === 100 && beneficiaries.length > 0

  const handleNext = () => {
    setWillData({ ...willData, beneficiaries })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Add Beneficiaries</h2>
            <p className="text-muted-foreground">Specify who will inherit your digital assets</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalPercentage}%</div>
            <div className="text-sm text-muted-foreground">Total Allocation</div>
          </div>
        </div>

        {/* Beneficiaries List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="bg-muted/50 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{beneficiary.name}</h3>
                    <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{beneficiary.percentage}%</div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      beneficiary.status === "verified"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                  >
                    {beneficiary.status}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {beneficiary.walletAddress.slice(0, 10)}...{beneficiary.walletAddress.slice(-6)}
              </div>
            </div>
          ))}
        </div>

        {/* Add Beneficiary Button */}
        <Button variant="outline" className="w-full bg-transparent">
          <Users className="w-4 h-4 mr-2" />
          Add New Beneficiary
        </Button>

        {/* Validation */}
        {totalPercentage !== 100 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Total allocation must equal 100%. Currently: {totalPercentage}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" disabled>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!canProceed} className="bg-primary hover:bg-primary/90">
          Next: Select Assets
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

const AssetStep = ({ willData, setWillData, onNext, onPrevious, currentStep, totalSteps }) => {
  const [selectedAssets, setSelectedAssets] = useState([
    {
      id: "sui",
      name: "SUI",
      type: "token",
      balance: 1250.5,
      usdValue: 2501.0,
      selected: true,
      percentage: 100,
    },
    {
      id: "usdc",
      name: "USDC",
      type: "token",
      balance: 5000.0,
      usdValue: 5000.0,
      selected: true,
      percentage: 100,
    },
    {
      id: "nft1",
      name: "Sui Punks #1234",
      type: "nft",
      collection: "Sui Punks",
      selected: true,
      percentage: 100,
    },
  ])

  const [executionSettings, setExecutionSettings] = useState({
    deadManSwitch: true,
    inactivityPeriod: 365,
    requireMultiSig: false,
    backupExecutors: [],
  })

  const handleNext = () => {
    setWillData({
      ...willData,
      assets: selectedAssets.filter((asset) => asset.selected),
      executionConditions: executionSettings,
    })
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Asset Selection */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Select Digital Assets</h2>
        <p className="text-muted-foreground mb-6">Choose which assets to include in your will</p>

        <div className="space-y-4">
          {selectedAssets.map((asset) => (
            <div
              key={asset.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                asset.selected ? "border-primary bg-primary/5" : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={asset.selected}
                    onChange={(e) =>
                      setSelectedAssets(
                        selectedAssets.map((a) => (a.id === asset.id ? { ...a, selected: e.target.checked } : a)),
                      )
                    }
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <div>
                    <h3 className="font-medium text-card-foreground">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {asset.type === "token"
                        ? `${asset.balance} ${asset.name} ($${asset.usdValue.toLocaleString()})`
                        : asset.collection}
                    </p>
                  </div>
                </div>
                {asset.selected && (
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Include</div>
                    <div className="text-lg font-bold text-primary">100%</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Execution Settings</h2>
        <p className="text-muted-foreground mb-6">Configure when and how your will should be executed</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium text-card-foreground">Dead Man's Switch</h3>
                <p className="text-sm text-muted-foreground">Automatically execute after inactivity period</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={executionSettings.deadManSwitch}
              onChange={(e) => setExecutionSettings({ ...executionSettings, deadManSwitch: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
          </div>

          {executionSettings.deadManSwitch && (
            <div className="ml-8 p-4 bg-muted/20 rounded-xl">
              <label className="block text-sm font-medium text-card-foreground mb-2">Inactivity Period (days)</label>
              <input
                type="number"
                value={executionSettings.inactivityPeriod}
                onChange={(e) =>
                  setExecutionSettings({ ...executionSettings, inactivityPeriod: Number.parseInt(e.target.value) })
                }
                className="w-32 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                min="30"
                max="3650"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 30 days, maximum 10 years</p>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium text-card-foreground">Multi-Signature Security</h3>
                <p className="text-sm text-muted-foreground">Require multiple confirmations for execution</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={executionSettings.requireMultiSig}
              onChange={(e) => setExecutionSettings({ ...executionSettings, requireMultiSig: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
          Next: Review & Deploy
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

const ReviewStep = ({ willData, onPrevious, isDeploying, onDeploy }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false)

  const mockPrivateKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

  return (
    <div className="space-y-6">
      {/* Will Summary */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-6">Review Your Will</h2>

        {/* Beneficiaries Summary */}
        <div className="mb-6">
          <h3 className="font-medium text-card-foreground mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Beneficiaries (3)
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Sarah Johnson (Daughter)</span>
              <span className="font-medium text-primary">40%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Michael Johnson (Son)</span>
              <span className="font-medium text-primary">35%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Red Cross Foundation (Charity)</span>
              <span className="font-medium text-primary">25%</span>
            </div>
          </div>
        </div>

        {/* Assets Summary */}
        <div className="mb-6">
          <h3 className="font-medium text-card-foreground mb-3 flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            Digital Assets (3)
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">1,250.50 SUI</span>
              <span className="text-muted-foreground">$2,501.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">5,000.00 USDC</span>
              <span className="text-muted-foreground">$5,000.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Sui Punks #1234</span>
              <span className="text-muted-foreground">NFT</span>
            </div>
          </div>
        </div>

        {/* Execution Settings */}
        <div className="mb-6">
          <h3 className="font-medium text-card-foreground mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Execution Settings
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Dead Man's Switch</span>
              <span className="text-green-600 font-medium">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Inactivity Period</span>
              <span className="text-muted-foreground">365 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Security & Privacy</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Your will is encrypted with AES-256 encryption</li>
              <li>• Smart contract deployed on Sui blockchain</li>
              <li>• Only beneficiaries can access after execution</li>
              <li>• Immutable and tamper-proof storage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deployment Key */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-medium text-card-foreground mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Deployment Key
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          This key will be used to deploy your will to the blockchain. Keep it secure.
        </p>
        <div className="flex items-center space-x-3">
          <div className="flex-1 p-3 bg-muted/30 rounded-lg font-mono text-sm">
            {showPrivateKey ? mockPrivateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="flex-shrink-0"
          >
            {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isDeploying}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onDeploy} disabled={isDeploying} className="bg-primary hover:bg-primary/90">
          {isDeploying ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2">
                <Zap className="w-4 h-4" />
              </div>
              Deploying to Blockchain...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 mr-2" />
              Deploy Will
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

const DeploymentSuccess = ({ willData, deploymentResult }) => {
  const contractAddress = deploymentResult?.contractAddress || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
  const transactionHash = deploymentResult?.transactionHash || "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  const willIndex = deploymentResult?.willIndex

  return (
    <div className="max-w-2xl mx-auto text-center p-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-4">Will Successfully Deployed!</h1>
      <p className="text-muted-foreground mb-8">
        Your digital will has been securely deployed to the Sui blockchain and is now active.
      </p>

      <div className="bg-card rounded-xl p-6 border border-border mb-8 text-left">
        <h3 className="font-semibold text-card-foreground mb-4">Deployment Details</h3>
        <div className="space-y-3">
          {willIndex && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Will Index:</span>
              <span className="font-semibold text-primary">#{willIndex}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contract Address:</span>
            <span className="font-mono text-sm">
              {contractAddress.slice(0, 10)}...{contractAddress.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction Hash:</span>
            <span className="font-mono text-sm">
              {transactionHash.slice(0, 10)}...{transactionHash.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network:</span>
            <span>Sui Mainnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-green-600 font-medium">{deploymentResult?.status || 'Active'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          View Will Details
        </Button>
        <Button variant="outline">
          <Globe className="w-4 h-4 mr-2" />
          View on Explorer
        </Button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Important:</strong> Save your contract address and transaction hash. You'll need them to manage your
          will in the future.
        </p>
      </div>
    </div>
  )
}

export default WillCreationFlow

// "use client"

// import { useState } from "react"
// import StepIndicator from "@/components/step-indicator"
// import { Button } from "@/components/ui/button"
// import { useApi } from "@/hooks/use-api"
// import { useWallet } from "@/lib/wallet-context"
// import { useAuth } from "@/lib/auth-context"
// import {
//   Shield,
//   Wallet,
//   FileText,
//   Users,
//   Clock,
//   AlertTriangle,
//   CheckCircle,
//   ArrowLeft,
//   ArrowRight,
//   Zap,
//   Lock,
//   Globe,
//   Eye,
//   EyeOff,
// } from "lucide-react"

// interface WillData {
//   beneficiaries: any[]
//   assets: any[]
//   messages: any[]
//   executionConditions: {
//     deadManSwitch: boolean
//     inactivityPeriod: number
//     backupExecutors: string[]
//   }
//   metadata: {
//     title: string
//     description: string
//     createdAt: string
//     lastModified: string
//   }
// }

// const WillCreationFlow = () => {
//   const { createWill, createWillState } = useApi()
//   const { address } = useWallet()
//   const { userId, password, isAuthenticated } = useAuth()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [completedSteps, setCompletedSteps] = useState<number[]>([])
//   const [willData, setWillData] = useState<WillData>({
//     beneficiaries: [],
//     assets: [],
//     messages: [],
//     executionConditions: {
//       deadManSwitch: true,
//       inactivityPeriod: 365,
//       backupExecutors: [],
//     },
//     metadata: {
//       title: "My Digital Will",
//       description: "",
//       createdAt: new Date().toISOString(),
//       lastModified: new Date().toISOString(),
//     },
//   })
//   const [deploymentComplete, setDeploymentComplete] = useState(false)
//   const [deploymentResult, setDeploymentResult] = useState<any>(null)

//   const steps = [
//     {
//       id: 1,
//       title: "Beneficiaries",
//       description: "Add recipients",
//       component: BeneficiaryStep,
//     },
//     {
//       id: 2,
//       title: "Assets",
//       description: "Select digital assets",
//       component: AssetStep,
//     },
//     {
//       id: 3,
//       title: "Review & Deploy",
//       description: "Finalize and deploy",
//       component: ReviewStep,
//     },
//   ]

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       setCompletedSteps([...completedSteps, currentStep])
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
//         heirs: willData.beneficiaries.map(b => b.walletAddress),
//         shares: willData.beneficiaries.map(b => Number(b.percentage) * 100),
//       }


//       const result = await createWill(apiWillData)
      
//       if (result && result.success) {
//         console.log("🎉 === WILL CREATION SUCCESS ===")
//         console.log(`✅ Will Index: ${result.willIndex}`)
//         console.log(`✅ Contract Address: ${result.contractAddress}`)
//         console.log(`✅ Transaction Hash: ${result.transactionHash}`)
//         console.log("==================================")
        
//         setDeploymentResult(result)
//         setDeploymentComplete(true)
//         setCompletedSteps([...completedSteps, currentStep])
        
//         // Show success message and navigate
//         alert(`🎉 Will Created Successfully!\n\nWill Index: ${result.willIndex}\nContract: ${result.contractAddress}`)
//         setTimeout(() => {
//           window.location.href = "/dashboard"
//         }, 2000)
//       } else {
//         console.error('Will creation failed:', result?.message)
//         alert(`❌ Will Creation Failed: ${result?.message || 'Unknown error'}`)
//       }
//     } catch (error) {
//       console.error('Deployment failed:', error)
//     }
//   }

//   const CurrentStepComponent = steps[currentStep - 1]?.component

//   if (deploymentComplete) {
//     return <DeploymentSuccess willData={willData} deploymentResult={deploymentResult} />
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Digital Will</h1>
//         <p className="text-muted-foreground">Follow the steps below to create and deploy your will on the blockchain</p>
//       </div>

//       {/* Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
//       </div>

//       {/* Step Content */}
//       <div className="mb-8">
//         {CurrentStepComponent && (
//           <CurrentStepComponent
//             willData={willData}
//             setWillData={setWillData}
//             onNext={handleNext}
//             onPrevious={handlePrevious}
//             isDeploying={createWillState.loading}
//             onDeploy={handleDeploy}
//             currentStep={currentStep}
//             totalSteps={steps.length}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// const BeneficiaryStep = ({ willData, setWillData, onNext, currentStep, totalSteps }) => {
//   const [beneficiaries, setBeneficiaries] = useState([
//     {
//       id: "1",
//       name: "Sarah Johnson",
//       relationship: "Daughter",
//       email: "sarah.johnson@email.com",
//       walletAddress: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
//       percentage: 40,
//       status: "verified",
//       type: "individual",
//     },
//     {
//       id: "2",
//       name: "Michael Johnson",
//       relationship: "Son",
//       email: "michael.johnson@email.com",
//       walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
//       percentage: 35,
//       status: "verified",
//       type: "individual",
//     },
//     {
//       id: "3",
//       name: "Red Cross Foundation",
//       relationship: "Charity",
//       email: "donations@redcross.org",
//       walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
//       percentage: 25,
//       status: "pending",
//       type: "organization",
//     },
//   ])

//   const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)
//   const canProceed = totalPercentage === 100 && beneficiaries.length > 0

//   const handleNext = () => {
//     setWillData({ ...willData, beneficiaries })
//     onNext()
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-card rounded-xl p-6 border border-border">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-xl font-semibold text-card-foreground">Add Beneficiaries</h2>
//             <p className="text-muted-foreground">Specify who will inherit your digital assets</p>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-primary">{totalPercentage}%</div>
//             <div className="text-sm text-muted-foreground">Total Allocation</div>
//           </div>
//         </div>

//         {/* Beneficiaries List */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           {beneficiaries.map((beneficiary) => (
//             <div key={beneficiary.id} className="bg-muted/50 rounded-xl p-4 border border-border">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//                     <Users className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-card-foreground">{beneficiary.name}</h3>
//                     <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-lg font-bold text-primary">{beneficiary.percentage}%</div>
//                   <div
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       beneficiary.status === "verified"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
//                         : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
//                     }`}
//                   >
//                     {beneficiary.status}
//                   </div>
//                 </div>
//               </div>
//               <div className="text-xs text-muted-foreground font-mono">
//                 {beneficiary.walletAddress.slice(0, 10)}...{beneficiary.walletAddress.slice(-6)}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add Beneficiary Button */}
//         <Button variant="outline" className="w-full bg-transparent">
//           <Users className="w-4 h-4 mr-2" />
//           Add New Beneficiary
//         </Button>

//         {/* Validation */}
//         {totalPercentage !== 100 && (
//           <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
//               <p className="text-sm text-yellow-800 dark:text-yellow-200">
//                 Total allocation must equal 100%. Currently: {totalPercentage}%
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between">
//         <Button variant="outline" disabled>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Previous
//         </Button>
//         <Button onClick={handleNext} disabled={!canProceed} className="bg-primary hover:bg-primary/90">
//           Next: Select Assets
//           <ArrowRight className="w-4 h-4 ml-2" />
//         </Button>
//       </div>
//     </div>
//   )
// }

// const AssetStep = ({ willData, setWillData, onNext, onPrevious, currentStep, totalSteps }) => {
//   const [selectedAssets, setSelectedAssets] = useState([
//     {
//       id: "sui",
//       name: "SUI",
//       type: "token",
//       balance: 1250.5,
//       usdValue: 2501.0,
//       selected: true,
//       percentage: 100,
//     },
//     {
//       id: "usdc",
//       name: "USDC",
//       type: "token",
//       balance: 5000.0,
//       usdValue: 5000.0,
//       selected: true,
//       percentage: 100,
//     },
//     {
//       id: "nft1",
//       name: "Sui Punks #1234",
//       type: "nft",
//       collection: "Sui Punks",
//       selected: true,
//       percentage: 100,
//     },
//   ])

//   const [executionSettings, setExecutionSettings] = useState({
//     deadManSwitch: true,
//     inactivityPeriod: 365,
//     requireMultiSig: false,
//     backupExecutors: [],
//   })

//   const handleNext = () => {
//     setWillData({
//       ...willData,
//       assets: selectedAssets.filter((asset) => asset.selected),
//       executionConditions: executionSettings,
//     })
//     onNext()
//   }

//   return (
//     <div className="space-y-6">
//       {/* Asset Selection */}
//       <div className="bg-card rounded-xl p-6 border border-border">
//         <h2 className="text-xl font-semibold text-card-foreground mb-4">Select Digital Assets</h2>
//         <p className="text-muted-foreground mb-6">Choose which assets to include in your will</p>

//         <div className="space-y-4">
//           {selectedAssets.map((asset) => (
//             <div
//               key={asset.id}
//               className={`p-4 rounded-xl border-2 transition-all ${
//                 asset.selected ? "border-primary bg-primary/5" : "border-border bg-muted/30"
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <input
//                     type="checkbox"
//                     checked={asset.selected}
//                     onChange={(e) =>
//                       setSelectedAssets(
//                         selectedAssets.map((a) => (a.id === asset.id ? { ...a, selected: e.target.checked } : a)),
//                       )
//                     }
//                     className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
//                   />
//                   <div>
//                     <h3 className="font-medium text-card-foreground">{asset.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {asset.type === "token"
//                         ? `${asset.balance} ${asset.name} ($${asset.usdValue.toLocaleString()})`
//                         : asset.collection}
//                     </p>
//                   </div>
//                 </div>
//                 {asset.selected && (
//                   <div className="text-right">
//                     <div className="text-sm text-muted-foreground">Include</div>
//                     <div className="text-lg font-bold text-primary">100%</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Execution Settings */}
//       <div className="bg-card rounded-xl p-6 border border-border">
//         <h2 className="text-xl font-semibold text-card-foreground mb-4">Execution Settings</h2>
//         <p className="text-muted-foreground mb-6">Configure when and how your will should be executed</p>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
//             <div className="flex items-center space-x-3">
//               <Clock className="w-5 h-5 text-primary" />
//               <div>
//                 <h3 className="font-medium text-card-foreground">Dead Man's Switch</h3>
//                 <p className="text-sm text-muted-foreground">Automatically execute after inactivity period</p>
//               </div>
//             </div>
//             <input
//               type="checkbox"
//               checked={executionSettings.deadManSwitch}
//               onChange={(e) => setExecutionSettings({ ...executionSettings, deadManSwitch: e.target.checked })}
//               className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
//             />
//           </div>

//           {executionSettings.deadManSwitch && (
//             <div className="ml-8 p-4 bg-muted/20 rounded-xl">
//               <label className="block text-sm font-medium text-card-foreground mb-2">Inactivity Period (days)</label>
//               <input
//                 type="number"
//                 value={executionSettings.inactivityPeriod}
//                 onChange={(e) =>
//                   setExecutionSettings({ ...executionSettings, inactivityPeriod: Number.parseInt(e.target.value) })
//                 }
//                 className="w-32 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
//                 min="30"
//                 max="3650"
//               />
//               <p className="text-xs text-muted-foreground mt-1">Minimum 30 days, maximum 10 years</p>
//             </div>
//           )}

//           <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
//             <div className="flex items-center space-x-3">
//               <Shield className="w-5 h-5 text-primary" />
//               <div>
//                 <h3 className="font-medium text-card-foreground">Multi-Signature Security</h3>
//                 <p className="text-sm text-muted-foreground">Require multiple confirmations for execution</p>
//               </div>
//             </div>
//             <input
//               type="checkbox"
//               checked={executionSettings.requireMultiSig}
//               onChange={(e) => setExecutionSettings({ ...executionSettings, requireMultiSig: e.target.checked })}
//               className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrevious}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Previous
//         </Button>
//         <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
//           Next: Review & Deploy
//           <ArrowRight className="w-4 h-4 ml-2" />
//         </Button>
//       </div>
//     </div>
//   )
// }

// const ReviewStep = ({ willData, onPrevious, isDeploying, onDeploy }) => {
//   const [showPrivateKey, setShowPrivateKey] = useState(false)

//   const mockPrivateKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

//   return (
//     <div className="space-y-6">
//       {/* Will Summary */}
//       <div className="bg-card rounded-xl p-6 border border-border">
//         <h2 className="text-xl font-semibold text-card-foreground mb-6">Review Your Will</h2>

//         {/* Beneficiaries Summary */}
//         <div className="mb-6">
//           <h3 className="font-medium text-card-foreground mb-3 flex items-center">
//             <Users className="w-4 h-4 mr-2" />
//             Beneficiaries (3)
//           </h3>
//           <div className="space-y-2">
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">Sarah Johnson (Daughter)</span>
//               <span className="font-medium text-primary">40%</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">Michael Johnson (Son)</span>
//               <span className="font-medium text-primary">35%</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">Red Cross Foundation (Charity)</span>
//               <span className="font-medium text-primary">25%</span>
//             </div>
//           </div>
//         </div>

//         {/* Assets Summary */}
//         <div className="mb-6">
//           <h3 className="font-medium text-card-foreground mb-3 flex items-center">
//             <Wallet className="w-4 h-4 mr-2" />
//             Digital Assets (3)
//           </h3>
//           <div className="space-y-2">
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">1,250.50 SUI</span>
//               <span className="text-muted-foreground">$2,501.00</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">5,000.00 USDC</span>
//               <span className="text-muted-foreground">$5,000.00</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">Sui Punks #1234</span>
//               <span className="text-muted-foreground">NFT</span>
//             </div>
//           </div>
//         </div>

//         {/* Execution Settings */}
//         <div className="mb-6">
//           <h3 className="font-medium text-card-foreground mb-3 flex items-center">
//             <Clock className="w-4 h-4 mr-2" />
//             Execution Settings
//           </h3>
//           <div className="space-y-2">
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">Dead Man's Switch</span>
//               <span className="text-green-600 font-medium">Enabled</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//               <span className="text-sm">Inactivity Period</span>
//               <span className="text-muted-foreground">365 days</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Security Information */}
//       <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
//         <div className="flex items-start space-x-3">
//           <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
//           <div>
//             <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Security & Privacy</h3>
//             <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
//               <li>• Your will is encrypted with AES-256 encryption</li>
//               <li>• Smart contract deployed on Sui blockchain</li>
//               <li>• Only beneficiaries can access after execution</li>
//               <li>• Immutable and tamper-proof storage</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Deployment Key */}
//       <div className="bg-card rounded-xl p-6 border border-border">
//         <h3 className="font-medium text-card-foreground mb-3 flex items-center">
//           <Shield className="w-4 h-4 mr-2" />
//           Deployment Key
//         </h3>
//         <p className="text-sm text-muted-foreground mb-4">
//           This key will be used to deploy your will to the blockchain. Keep it secure.
//         </p>
//         <div className="flex items-center space-x-3">
//           <div className="flex-1 p-3 bg-muted/30 rounded-lg font-mono text-sm">
//             {showPrivateKey ? mockPrivateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowPrivateKey(!showPrivateKey)}
//             className="flex-shrink-0"
//           >
//             {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//           </Button>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrevious} disabled={isDeploying}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Previous
//         </Button>
//         <Button onClick={onDeploy} disabled={isDeploying} className="bg-primary hover:bg-primary/90">
//           {isDeploying ? (
//             <>
//               <div className="animate-spin w-4 h-4 mr-2">
//                 <Zap className="w-4 h-4" />
//               </div>
//               Deploying to Blockchain...
//             </>
//           ) : (
//             <>
//               <Globe className="w-4 h-4 mr-2" />
//               Deploy Will
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

// const DeploymentSuccess = ({ willData, deploymentResult }) => {
//   const contractAddress = deploymentResult?.contractAddress || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
//   const transactionHash = deploymentResult?.transactionHash || "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
//   const willIndex = deploymentResult?.willIndex

//   return (
//     <div className="max-w-2xl mx-auto text-center p-6">
//       <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
//         <CheckCircle className="w-12 h-12 text-green-600" />
//       </div>

//       <h1 className="text-3xl font-bold text-foreground mb-4">Will Successfully Deployed!</h1>
//       <p className="text-muted-foreground mb-8">
//         Your digital will has been securely deployed to the Sui blockchain and is now active.
//       </p>

//       <div className="bg-card rounded-xl p-6 border border-border mb-8 text-left">
//         <h3 className="font-semibold text-card-foreground mb-4">Deployment Details</h3>
//         <div className="space-y-3">
//           {willIndex && (
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Will Index:</span>
//               <span className="font-semibold text-primary">#{willIndex}</span>
//             </div>
//           )}
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Contract Address:</span>
//             <span className="font-mono text-sm">
//               {contractAddress.slice(0, 10)}...{contractAddress.slice(-6)}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Transaction Hash:</span>
//             <span className="font-mono text-sm">
//               {transactionHash.slice(0, 10)}...{transactionHash.slice(-6)}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Network:</span>
//             <span>Sui Mainnet</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Status:</span>
//             <span className="text-green-600 font-medium">{deploymentResult?.status || 'Active'}</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 justify-center">
//         <Button className="bg-primary hover:bg-primary/90">
//           <FileText className="w-4 h-4 mr-2" />
//           View Will Details
//         </Button>
//         <Button variant="outline">
//           <Globe className="w-4 h-4 mr-2" />
//           View on Explorer
//         </Button>
//       </div>

//       <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
//         <p className="text-sm text-blue-800 dark:text-blue-200">
//           <strong>Important:</strong> Save your contract address and transaction hash. You'll need them to manage your
//           will in the future.
//         </p>
//       </div>
//     </div>
//   )
// }

// export default WillCreationFlow