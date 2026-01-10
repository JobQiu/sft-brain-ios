import { QADetailClient } from "./qa-detail-client"

// For static export - generate a placeholder
export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function MobileQADetailPage() {
  return <QADetailClient />
}
