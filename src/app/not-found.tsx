import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-4">
        404 / NOT FOUND
      </p>
      <h1 className="font-serif text-4xl md:text-6xl text-espresso mb-4">
        Out of the collection.
      </h1>
      <p className="text-base text-espresso/60 max-w-md mb-8 leading-relaxed">
        The item, collection, or room you are looking for is currently not available or has moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-espresso text-ivory text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-wine transition-colors"
        >
          Return to Showroom
        </Link>
        <Link
          href="/collections"
          className="px-6 py-3 border border-espresso/20 text-espresso text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-espresso hover:text-ivory transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    </div>
  );
}

