import ToolLayout from '@/components/ToolLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { generateToolMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/convert/pdf-to-word",
  },
}
// export const generateMetadata = () => generateToolMetadata(
//   'pdf-to-word', 
//   'PDF to Word', 
//   'Convert PDF to Word online for free. Turn PDF files into editable DOCX documents with our fast, secure, and accurate converter.'
// );

export default function PDFToWord() {
  return (
    <>
      <Navbar />
      <ToolLayout 
        title="PDF to Word Converter" 
        description="Convert PDF to Word online for free. Turn PDF files into editable DOCX documents with our fast, secure, and accurate converter." 
        apiEndpoint="/api/pdf/pdf-to-word"
        acceptedTypes={['.pdf']}
        howItWorks={[
          {
            title: 'Upload Your PDF File',
            description: 'Drag and drop your PDF into the converter or select it from your device.'
          },
          {
            title: 'Automatic Conversion',
            description: 'Our advanced conversion engine analyzes the document and converts it into an editable Word file.'
          },
          {
            title: 'Download Your Word Document',
            description: 'Download your converted DOCX file instantly and start editing right away.'
          }
        ]}
      />
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Convert PDF to Word Online for Free</h2>
            <p className="text-gray-600 mb-4">
              Need to edit a PDF document? Our PDF to Word Converter transforms your PDF files into fully editable Microsoft Word documents in seconds. Preserve formatting, text, images, tables, and layouts while converting PDFs into DOCX files that are easy to edit and share.
            </p>
            <p className="text-gray-600">
              Whether you're working on business reports, contracts, invoices, resumes, research papers, or school assignments, our tool makes PDF conversion quick, secure, and accurate.
            </p>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Why Convert PDF to Word?</h3>
            <p className="text-gray-600 mb-4">
              PDF files are great for sharing documents, but editing them can be difficult. Converting a PDF to Word allows you to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Edit text and images easily</li>
              <li>Update contracts and agreements</li>
              <li>Modify reports and presentations</li>
              <li>Reuse content without retyping</li>
              <li>Collaborate with team members</li>
              <li>Correct mistakes in existing documents</li>
            </ul>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Features of Our PDF to Word Converter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'High-Quality Conversion',
                  description: 'Maintain the original formatting, fonts, spacing, tables, images, and document structure.'
                },
                {
                  title: 'Fast Processing',
                  description: 'Convert PDF files to Word within seconds, even for large documents.'
                },
                {
                  title: 'Secure File Handling',
                  description: 'Your files are encrypted during upload and automatically removed from our servers after processing.'
                },
                {
                  title: 'No Installation Required',
                  description: 'Use the converter directly from your browser on Windows, Mac, Linux, Android, or iPhone.'
                },
                {
                  title: 'Works on Any Device',
                  description: 'Convert PDFs from desktops, laptops, tablets, and smartphones.'
                },
                {
                  title: 'Batch PDF Conversion',
                  description: 'Upload and convert multiple PDF files at once to save time and improve productivity.'
                }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Supported File Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">Input Format</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>PDF (.pdf)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Output Formats</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>DOCX (.docx)</li>
                  <li>DOC (.doc)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Convert Scanned PDFs to Word</h3>
            <p className="text-gray-600 mb-4">
              Unlike basic converters, our OCR-powered technology can extract text from scanned PDF documents and images. This allows you to convert scanned contracts, invoices, forms, books, and printed documents into editable Word files.
            </p>
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
              <h4 className="font-bold mb-3 text-orange-800">OCR Benefits</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Recognizes text from scanned PDFs</li>
                <li>Preserves document structure</li>
                <li>Supports multiple languages</li>
                <li>Improves editing accuracy</li>
              </ul>
            </div>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Who Uses PDF to Word Conversion?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Students',
                  description: 'Edit assignments, research papers, lecture notes, and academic documents.'
                },
                {
                  title: 'Business Professionals',
                  description: 'Update contracts, proposals, invoices, and reports quickly.'
                },
                {
                  title: 'Teachers and Educators',
                  description: 'Modify study materials and classroom resources.'
                },
                {
                  title: 'Legal Professionals',
                  description: 'Edit legal agreements, forms, and documentation.'
                },
                {
                  title: 'Freelancers',
                  description: 'Repurpose client documents and project files efficiently.'
                }
              ].map((user, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-bold mb-2">{user.title}</h4>
                  <p className="text-gray-600">{user.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Benefits of Using Our PDF to Word Tool</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Free online conversion</li>
              <li>No software downloads</li>
              <li>Accurate formatting preservation</li>
              <li>Secure and private processing</li>
              <li>Unlimited conversions</li>
              <li>Mobile-friendly interface</li>
              <li>Fast conversion speed</li>
              <li>OCR support for scanned PDFs</li>
            </ul>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">PDF to Word vs Manual Re-Typing</h3>
            <p className="text-gray-600">
              Manually retyping content from a PDF can take hours and introduce errors. Our PDF to Word converter automatically extracts and recreates your document in an editable format, saving valuable time and ensuring accuracy.
            </p>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {[
                {
                  question: 'Is the PDF to Word Converter free?',
                  answer: 'Yes, you can convert PDF files to Word documents online without any cost.'
                },
                {
                  question: 'Will my formatting be preserved?',
                  answer: 'Yes. Our converter maintains fonts, images, tables, spacing, and layouts whenever possible.'
                },
                {
                  question: 'Can I convert scanned PDFs?',
                  answer: 'Yes. OCR technology enables conversion of scanned PDF documents into editable Word files.'
                },
                {
                  question: 'Is my data secure?',
                  answer: 'Absolutely. Files are encrypted during processing and automatically deleted after conversion.'
                },
                {
                  question: 'Can I use the converter on mobile devices?',
                  answer: 'Yes. The converter works on Android phones, iPhones, tablets, and desktop computers.'
                },
                {
                  question: 'Is there a file size limit?',
                  answer: 'Large files are supported, though limits may vary depending on your plan or server configuration.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-bold mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-primary/5 border border-primary/20 p-10 rounded-3xl text-center">
            <h3 className="text-2xl font-bold mb-4">Start Converting PDF to Word Now</h3>
            <p className="text-gray-700 mb-6">
              Transform PDF files into editable Word documents instantly. Upload your PDF, convert it in seconds, and download a fully editable DOCX file without losing formatting. Fast, secure, accurate, and completely online.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
