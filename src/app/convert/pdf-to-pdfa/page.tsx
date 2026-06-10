import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PDFToPDFA() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to PDF/A" 
        description="Convert PDF documents to PDF/A for long-term archiving." 
        apiEndpoint="/api/pdf/pdf-to-pdfa"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
