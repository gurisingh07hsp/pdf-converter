import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolLayout from '@/components/ToolLayout';

export default function RotatePDFPage() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Rotate PDF" 
        description="Rotate pages in your PDF document." 
        apiEndpoint="/api/pdf/rotate-pdf"
        toolHref="/rotate-pdf"
        howItWorks={[
          { title: "Upload your PDF", description: "Select your PDF file." },
          { title: "Choose rotation", description: "Select how much to rotate pages." },
          { title: "Download PDF", description: "Download your rotated PDF document." }
        ]}
      />
      <Footer />
    </>
  );
}
