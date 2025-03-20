import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-base-100">
      <div className="text-center">
        <p className="text-9xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-base-content md:text-9xl">Page not found</h1>
        <p className="mt-6 text-lg font-medium text-pretty text-base-content/70 sm:text-xl/8">Sorry, we couldn't find the page you're looking for.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/" className="btn btn-primary">Go back home</Link>
          <Link to="/support" className="btn btn-ghost text-primary">
            Contact support <span aria-hidden="true" className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  )
}