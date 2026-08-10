import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { generateToolMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}
// export const generateMetadata = () => generateToolMetadata(
//   'compress', 
//   'Compress PDF', 
//   'Reduce file size while optimizing for maximum quality.'
  
// );

export default function CompressPage() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="Compress PDF" 
        description="Reduce file size while optimizing for maximum quality." 
        apiEndpoint="/api/pdf/compress"
        acceptedTypes={['.pdf']}
      />
      <Footer />
    </>
  );
}
