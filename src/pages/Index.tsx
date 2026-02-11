import { ClinicalProvider } from '@/context/ClinicalContext';
import { Dashboard } from '@/components/clinical/Dashboard';

const Index = () => {
  return (
    <ClinicalProvider>
      <Dashboard />
    </ClinicalProvider>
  );
};

export default Index;
