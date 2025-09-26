import { Check, Users, Wallet, FileText, AlertTriangle } from "lucide-react"

const StepIndicator = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    {
      id: 1,
      title: "Beneficiaries",
      description: "Add recipients",
      icon: Users,
      color: "indigo",
    },
    {
      id: 2,
      title: "Assets",
      description: "Select digital assets",
      icon: Wallet,
      color: "indigo",
    },
    {
      id: 3,
      title: "Review & Deploy",
      description: "Finalize and deploy",
      icon: FileText,
      color: "indigo",
    },
  ]

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return "completed"
    if (stepId === currentStep) return "active"
    if (stepId < currentStep) return "completed"
    return "upcoming"
  }

  const getStepStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-green-500 text-white border-green-500",
          title: "text-green-700",
          description: "text-green-600",
          connector: "bg-green-500",
        }
      case "active":
        return {
          circle: "bg-indigo-600 text-white border-indigo-600",
          title: "text-indigo-700 font-semibold",
          description: "text-indigo-600",
          connector: "bg-gray-200",
        }
      default:
        return {
          circle: "bg-gray-200 text-gray-500 border-gray-200",
          title: "text-gray-500",
          description: "text-gray-400",
          connector: "bg-gray-200",
        }
    }
  }

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const styles = getStepStyles(status)
            const isLastStep = index === steps.length - 1

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${styles.circle}`}
                  >
                    {status === "completed" ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                  </div>

                  {/* Step Info */}
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-medium transition-colors ${styles.title}`}>Step {step.id}</p>
                    <p className={`text-sm transition-colors ${styles.title}`}>{step.title}</p>
                    <p className={`text-xs mt-1 transition-colors ${styles.description}`}>{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLastStep && (
                  <div
                    className={`w-20 h-1 mx-4 rounded-full transition-all duration-200 ${
                      status === "completed" ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id)
              const styles = getStepStyles(status)
              const isActive = step.id === currentStep

              if (!isActive && status !== "completed") return null

              return (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${styles.circle}`}>
                    {status === "completed" ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${styles.title}`}>
                      Step {step.id}: {step.title}
                    </p>
                    <p className={`text-xs ${styles.description}`}>{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="ml-4 flex flex-col items-end">
            <div className="flex space-x-1">
              {steps.map((step) => {
                const status = getStepStatus(step.id)
                return (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      status === "completed" ? "bg-green-500" : status === "active" ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {currentStep} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Completion Summary */}
      {completedSteps.length > 0 && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-green-500" />
          <span>
            {completedSteps.length} of {steps.length} steps completed
          </span>
        </div>
      )}

      {/* Warning for incomplete steps */}
      {currentStep === steps.length && completedSteps.length < steps.length - 1 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              Please complete all previous steps before proceeding to deployment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StepIndicator
