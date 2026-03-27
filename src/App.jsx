import { ProjectProvider, useProject } from './state/ProjectContext.jsx'
import Header from './components/layout/Header.jsx'
import StepNavigator from './components/layout/StepNavigator.jsx'
import FinancialModelPanel from './components/layout/FinancialModelPanel.jsx'
import Step1SiteSelection from './components/steps/Step1SiteSelection.jsx'
import Step2Assemblage from './components/steps/Step2Assemblage.jsx'
import Step3Reimagination from './components/steps/Step3Reimagination.jsx'
import Step4Identity from './components/steps/Step4Identity.jsx'
import Step5MasterPlan from './components/steps/Step5MasterPlan.jsx'
import Step6Entitlements from './components/steps/Step6Entitlements.jsx'
import Step7Drivers from './components/steps/Step7Drivers.jsx'
import Step8Infrastructure from './components/steps/Step8Infrastructure.jsx'
import Step9Disposition from './components/steps/Step9Disposition.jsx'
import StepProforma from './components/steps/StepProforma.jsx'

const stepComponents = {
  1: Step1SiteSelection,
  2: Step2Assemblage,
  3: Step3Reimagination,
  4: Step4Identity,
  5: Step5MasterPlan,
  6: Step6Entitlements,
  7: Step7Drivers,
  8: Step8Infrastructure,
  9: Step9Disposition,
  10: StepProforma,
}

function AppContent() {
  const { currentStep } = useProject()
  const StepComponent = stepComponents[currentStep] || Step1SiteSelection

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header />
      <StepNavigator />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6">
        <StepComponent />
      </main>
      <FinancialModelPanel />
    </div>
  )
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  )
}
