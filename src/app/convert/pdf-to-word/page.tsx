import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'pdf-to-word', 
  'PDF to Word', 
  'Convert PDF documents to editable Microsoft Word files.'
);

export default function PDFToWord() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to Word" 
        description="Convert PDF documents to editable Microsoft Word files." 
        apiEndpoint="/api/pdf/pdf-to-word"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
