import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HTMLToPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="HTML to PDF" 
        description="Convert web pages or HTML files to PDF documents." 
        apiEndpoint="/api/pdf/html-to-pdf"
        acceptedTypes={['.html', '.htm']}
      />
      <Footer />
    </>
  );
}
