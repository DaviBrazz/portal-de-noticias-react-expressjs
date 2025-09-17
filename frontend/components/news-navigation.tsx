import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface NewsNavigationProps {
  items: NavItem[];
}

export function NewsNavigation({ items }: NewsNavigationProps) {
  return (
    <nav className="border-b bg-yellow-200"> {/* Altere bg-red para bg-red-500 */}
      <div className="container mx-auto  px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="font-bold text-xl mb-4 sm:mb-0">Portal de Notícias</div>
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
