import Link from "next/link";

export default function PostNavigation({ previous, next }) {
  if (!previous && !next) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 my-16 border-t border-gray-100 pt-10">
      <div className="flex-1 group">
        {previous && (
          <Link href={`/${previous.slug}`} className="flex flex-col gap-3 p-8 bg-gray-50/50 hover:bg-gray-100/80 transition-all duration-300 border border-transparent hover:border-gray-200">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              Previous article
            </span>
            <h4 className="text-base md:text-lg font-black leading-tight text-black group-hover:text-brand-primary transition-colors" dangerouslySetInnerHTML={{ __html: previous.title }} />
          </Link>
        )}
      </div>

      <div className="flex-1 group text-right">
        {next && (
          <Link href={`/${next.slug}`} className="flex flex-col gap-3 p-8 bg-gray-50/50 hover:bg-gray-100/80 transition-all duration-300 border border-transparent hover:border-gray-200">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              Next article
            </span>
            <h4 className="text-base md:text-lg font-black leading-tight text-black group-hover:text-brand-primary transition-colors" dangerouslySetInnerHTML={{ __html: next.title }} />
          </Link>
        )}
      </div>
    </div>
  );
}
