import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { generateToolMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/txt-to-pdf",
  },
}
// export const generateMetadata = () => generateToolMetadata(
//   'txt-to-pdf', 
//   'TXT to PDF', 
//   'Make TXT files easy to read by converting them to PDF.'
// );
const TXT_TO_PDF = () => {
  return (
    <>
        <Navbar />
        <ToolLayout 
        title="TXT to PDF" 
        description="Make TXT files easy to read by converting them to PDF." 
        apiEndpoint="/api/pdf/txt-to-pdf"
        acceptedTypes={['.txt']}
        />
        <Footer />
    </>
  )
}

export default TXT_TO_PDF
