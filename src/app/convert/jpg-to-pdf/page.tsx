import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'jpg-to-pdf', 
  'JPG to PDF', 
  'Convert images to PDF documents in seconds.'
);

export default function JPGToPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="JPG to PDF" 
        description="Convert images to PDF documents in seconds." 
        apiEndpoint="/api/pdf/jpg-to-pdf"
        acceptedTypes={['.jpg', '.jpeg', '.png']}
        multiple={true}
      />
      <Footer />
    </>
  );
}
