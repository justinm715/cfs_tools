import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar() {

  const router = useRouter()

  return (
    <div className="p-2">
      
      <h2 className="pb-2 font-bold ">Getting Started</h2>
      
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

      <h2 className="pb-2 font-bold ">Project</h2>
      
      <ul>
        <li className={router.pathname == "/tools/design_criteria" ? "text-sky-600" : ""}>
          <Link href="/tools/design_criteria">
            <a className="block pl-2 border-l border-l-slate-500 hover:border-l-sky-500">Design Criteria</a>
          </Link>
        </li>
        <li className={router.pathname == "/tools/interior_schedules" ? "text-sky-600" : ""}>
          <Link href="/tools/interior_schedules">
            <a className="block pl-2 border-l border-l-slate-500 hover:border-l-sky-500">Interior Schedules</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}