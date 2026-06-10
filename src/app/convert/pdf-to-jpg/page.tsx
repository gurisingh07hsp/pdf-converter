import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PDFToJPG() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to JPG" 
        description="Extract images or convert PDF pages to JPG format." 
        apiEndpoint="/api/pdf/pdf-to-jpg"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
