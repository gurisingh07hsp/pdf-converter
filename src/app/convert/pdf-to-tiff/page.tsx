import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/pdf-to-tiff",
  },
}
export default function PDFToTIFF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to TIFF" 
        description="Convert your PDF documents to TIFF." 
        apiEndpoint="/api/pdf/pdf-to-tiff"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}