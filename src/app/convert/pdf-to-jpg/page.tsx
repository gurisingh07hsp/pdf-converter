import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/pdf-to-jpg",
  },
}
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
