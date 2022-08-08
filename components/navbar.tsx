import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar() {

  const router = useRouter()
  
  return (
    <>
      <ul className="mb-3">
        <li className={router.pathname == "/" ? "font-bold" : ""}>
          <Link href="/">
            Home  
          </Link>
        </li>
        <li className={router.pathname == "/about" ? "font-bold" : ""}>
          <Link href="/about" className={router.pathname == "/about" ? "active" : ""}>
            About
          </Link>
        </li>
      </ul>
      <ul>
        <li className={router.pathname == "/docs/design_criteria" ? "font-bold" : ""}>
          <Link href="/docs/design_criteria">
            Design Criteria
          </Link>
        </li>
      </ul>
    </>
  )
}