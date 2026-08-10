import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/pdf-to-excel",
  },
}
export default function PDFToExcel() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to Excel" 
        description="Convert PDF documents to editable Excel spreadsheets." 
        apiEndpoint="/api/pdf/pdf-to-excel"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
