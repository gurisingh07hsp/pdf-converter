import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { generateToolMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/merge",
  },
}
// export const generateMetadata = () => generateToolMetadata(
//   'merge', 
//   'Merge PDF', 
//   'Combine multiple PDFs into one document in seconds.'
// );

export default function MergePage() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Merge PDF" 
        description="Combine multiple PDFs into one document in seconds." 
        apiEndpoint="/api/pdf/merge"
        toolHref="/merge"
        howItWorks={[
          { title: "Select your PDFs", description: "Upload the PDF files you want to merge." },
          { title: "Arrange order (optional)", description: "Drag and drop to reorder your files if needed." },
          { title: "Download merged PDF", description: "Click download to get your combined PDF file." }
        ]}
        acceptedTypes={['.pdf']}
        multiple={true}
      />
      <Footer />
    </>
  );
}
