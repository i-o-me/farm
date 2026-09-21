import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
        404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        This plant is not in our catalog.
      </h1>
      <p className="mt-4 max-w-xl text-base text-stone-600">
        The page you are looking for is missing, or the plant may have moved to a new section.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-[#2F5D3A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#24462f]"
      >
        Back to home
      </Link>
    </main>
  );
}
