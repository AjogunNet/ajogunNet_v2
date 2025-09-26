import { BalanceTest } from "@/components/balance-test"

export default function BalanceTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Balance Integration Test</h1>
      <BalanceTest />
    </div>
  )
}