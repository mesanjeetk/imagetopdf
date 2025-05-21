import React from 'react'
import FileUpload from "@/components/FileUpload"
import PDFSettings from '@/components/PDFSettings';
import ImagePreview from '@/components/ImagePreview';
const Page = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <FileUpload />
          <ImagePreview />
        </div>
        <div className="md:col-span-1">
          <PDFSettings />
        </div>
      </div>
    </main>
  )
}

export default Page