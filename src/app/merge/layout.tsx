import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'merge', 
  'Merge PDF', 
  'Combine multiple PDFs into one document in seconds.'
);

export default function MergeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
