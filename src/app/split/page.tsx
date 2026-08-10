import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { generateToolMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/split",
  },
}
// export const generateMetadata = () => generateToolMetadata(
//   'split', 
//   'Split PDF', 
//   'Separate one page or a whole set for easy management.'
// );

export default function SplitPDF() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Split PDF" 
        description="Separate one page or a whole set for easy management." 
        apiEndpoint="/api/pdf/split"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
