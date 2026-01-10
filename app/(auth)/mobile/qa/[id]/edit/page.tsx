import { QAEditClient } from "./qa-edit-client"

// For static export - generate a placeholder
export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function MobileQAEditPage() {
  return <QAEditClient />
}
