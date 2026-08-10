import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/pdf-to-zip",
  },
}
const PDFToZIP = () => {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF To ZIP" 
        description="Convert your PDF file to ZIP." 
        apiEndpoint="/api/pdf/pdf-to-zip"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  )
}

export default PDFToZIP
