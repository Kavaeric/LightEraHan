// Entrypoint page
import '../../main.css'
import { ClientOnly } from './client'
 
export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
