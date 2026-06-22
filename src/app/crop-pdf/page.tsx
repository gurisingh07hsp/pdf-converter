import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolLayout from '@/components/ToolLayout';

export default function CropPDFPage() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Crop PDF" 
        description="Crop pages in your PDF document." 
        apiEndpoint="/api/pdf/crop-pdf"
        toolHref="/crop-pdf"
        howItWorks={[
          { title: "Upload your PDF", description: "Select your PDF file." },
          { title: "Select area to crop", description: "Choose the region to keep." },
          { title: "Download PDF", description: "Download your cropped PDF document." }
        ]}
      />
      <Footer />
    </>
  );
}
