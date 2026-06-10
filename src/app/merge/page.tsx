import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'merge', 
  'Merge PDF', 
  'Combine multiple PDFs into one document in seconds.'
);

export default function MergePage() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Merge PDF" 
        description="Combine multiple PDFs into one document in seconds." 
        apiEndpoint="/api/pdf/merge"
        acceptedTypes={['.pdf']}
        multiple={true}
      />
      <Footer />
    </>
  );
}
