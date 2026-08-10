import { getToolBySlug } from "@/lib/tools";
import { notFound } from "next/navigation";
import ToolRenderer from "./ToolRenderer";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};

  return {
    title: tool.seo?.metaTitle || `${tool.slug} - PDFSwift`,
    description: tool.seo?.metaDescription || tool.shortDescription,
    keywords: tool.seo?.keywords,
    alternates: {
    canonical: "/tools/" + tool.slug,
  },
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return <ToolRenderer tool={tool} />;
}
