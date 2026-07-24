import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
