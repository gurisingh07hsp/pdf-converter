import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/repair-pdf",
  },
}
const RepairPDF = () => {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Repair PDF" 
        description="Recover data from a corrupted or damaged PDF document" 
        apiEndpoint="/api/pdf/repair-pdf"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  )
}

export default RepairPDF
