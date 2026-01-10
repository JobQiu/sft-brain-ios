import { QAEditClient } from "./qa-edit-client"

// Required for static export - returns empty array since routes are client-side only
export async function generateStaticParams() {
  return []
}

export default function MobileQAEditPage() {
  return <QAEditClient />
}
