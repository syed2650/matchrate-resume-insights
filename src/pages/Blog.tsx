
import { ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Blog() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ScrollText className="h-8 w-8" />
        Blog
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Top Resume Tips for Product Managers</h2>
          <p className="text-slate-600 mb-4">Learn how to highlight your product management experience effectively.</p>
          <p className="text-sm text-slate-400">April 15, 2024</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Mastering ATS-Friendly Resumes</h2>
          <p className="text-slate-600 mb-4">A comprehensive guide to creating resumes that pass ATS systems.</p>
          <p className="text-sm text-slate-400">April 10, 2024</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">The Future of AI in Hiring</h2>
          <p className="text-slate-600 mb-4">Understanding how AI is transforming the recruitment process.</p>
          <p className="text-sm text-slate-400">April 5, 2024</p>
        </Card>
      </div>
    </div>
  );
}
