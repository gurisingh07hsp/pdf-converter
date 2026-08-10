import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/tiff-to-pdf",
  },
}
const TIFFToPDF = () => {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="TIFF to PDF" 
        description="Convert your TIFF files to PDF." 
        apiEndpoint="/api/pdf/tiff-to-pdf"
        acceptedTypes={['.tiff']}
      />
      <Footer />
    </>
  )
}

export default TIFFToPDF
