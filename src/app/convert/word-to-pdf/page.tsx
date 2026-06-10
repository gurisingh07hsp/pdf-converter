import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'word-to-pdf', 
  'Word to PDF', 
  'Make DOC and DOCX files easy to read by converting them to PDF.'
);

export default function WordToPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Word to PDF" 
        description="Make DOC and DOCX files easy to read by converting them to PDF." 
        apiEndpoint="/api/pdf/word-to-pdf"
        acceptedTypes={['.doc', '.docx']}
      />
      <Footer />
    </>
  );
}
