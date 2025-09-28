"use client";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { User, BadgeCheck } from "lucide-react";
import Image from "next/image";

const contributor = {
  name: "Harold Lee",
  totalUploads: 7,
  totalReuse: 12,
};

export default function Profile() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="flex items-center gap-4">
          <Image 
            src="/logo/new logo png.png" 
            alt="TRAIN Logo" 
            width={32} 
            height={32}
            className="object-contain"
          />
          <div className="flex items-center gap-2">
            <User className="text-blue-500" />
            <span className="font-bold text-lg">Contributor Profile</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">{contributor.name}</div>
          <div className="flex gap-6 mb-4">
            <div><b>Uploads:</b> {contributor.totalUploads}</div>
            <div><b>Reuse Credits:</b> {contributor.totalReuse}</div>
          </div>
          <div className="flex gap-2">
            {contributor.totalReuse > 5 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">
                <BadgeCheck size={16} /> Trusted Contributor
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
