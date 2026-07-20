import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'pdf-to-txt', 
  'PDF to TXT', 
  'Make PDF files easy to read by converting them to TXT.'
);
const ConvertPDFToTXT = () => {
  return (
    <>
        <Navbar />
        <ToolLayout 
        title="PDF to TXT" 
        description="Make PDF files easy to read by converting them to TXT." 
        apiEndpoint="/api/pdf/pdf-to-txt"
        acceptedTypes={['.pdf']}
        />
        <Footer />
    </>
  )
}

export default ConvertPDFToTXT
