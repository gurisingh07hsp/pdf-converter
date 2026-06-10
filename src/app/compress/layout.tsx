import { generateToolMetadata } from '@/lib/seo';

export const generateMetadata = () => generateToolMetadata(
  'compress', 
  'Compress PDF', 
  'Reduce file size while optimizing for maximum quality.'
);

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
