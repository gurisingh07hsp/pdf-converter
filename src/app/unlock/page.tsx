import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function UnlockPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Unlock PDF" 
        description="Remove password security from your protected files." 
        apiEndpoint="/api/pdf/unlock"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
