import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/powerpoint-to-pdf",
  },
}
export default function PowerPointToPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PowerPoint to PDF" 
        description="Convert your PowerPoint presentations to PDF documents." 
        apiEndpoint="/api/pdf/powerpoint-to-pdf"
        acceptedTypes={['.ppt', '.pptx']}
      />
      <Footer />
    </>
  );
}
