import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/excel-to-pdf",
  },
}
export default function ExcelToPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Excel to PDF" 
        description="Convert Excel spreadsheets to PDF documents." 
        apiEndpoint="/api/pdf/excel-to-pdf"
        acceptedTypes={['.xls', '.xlsx']}
      />
      <Footer />
    </>
  );
}
