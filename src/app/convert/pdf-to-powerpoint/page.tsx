import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/pdf-to-powerpoint",
  },
}
export default function PDFToPowerPoint() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to PowerPoint" 
        description="Convert your PDF documents to editable PowerPoint presentations." 
        apiEndpoint="/api/pdf/pdf-to-powerpoint"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
