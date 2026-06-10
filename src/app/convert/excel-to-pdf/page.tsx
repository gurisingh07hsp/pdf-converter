import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
