import { Shield, Database, Globe, Upload } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "../components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-6">
      <Card className="w-full max-w-xl mx-auto shadow-xl rounded-2xl mb-8">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={32} />
            <span className="text-3xl font-extrabold tracking-tight">TRAIN</span>
          </div>
          <span className="text-lg text-zinc-700 dark:text-zinc-300 text-center">Trusted AI + Infrastructure · Auditable Datasets for Cross-Border Trust.</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
            <Link href="/contributor" className="flex-1">
              <Card className="hover:shadow-2xl transition-shadow cursor-pointer flex flex-col items-center gap-2 py-8">
                <Upload className="text-blue-500" size={32} />
                <span className="font-semibold text-lg">Contributor</span>
                <span className="text-xs text-zinc-500">Upload & Certify Datasets</span>
              </Card>
            </Link>
            <Link href="/regulator" className="flex-1">
              <Card className="hover:shadow-2xl transition-shadow cursor-pointer flex flex-col items-center gap-2 py-8">
                <Database className="text-green-500" size={32} />
                <span className="font-semibold text-lg">Regulator</span>
                <span className="text-xs text-zinc-500">Review, Audit & Attribute</span>
              </Card>
            </Link>
          </div>
          <div className="flex justify-center mt-8">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
              <Globe size={16} /> Cross-Border Demo
            </span> 
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
