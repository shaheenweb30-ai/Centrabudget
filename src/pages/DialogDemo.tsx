import React from 'react'
import { DialogDemo } from '@/components/ui/dialog-demo'
import { Layout } from '@/components/Layout'

export default function DialogDemoPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <DialogDemo />
      </div>
    </Layout>
  )
}
