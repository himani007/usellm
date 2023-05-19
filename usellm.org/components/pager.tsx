import Link from "next/link";
import { Doc } from "contentlayer/generated";
import { NavItem, NavItemWithChildren } from "@/types/nav";
import ReactMarkdown from "react-markdown";
import { docsConfig } from "@/config/docs";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface DocsPagerProps {
  doc: Doc;
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className={buttonVariants({ variant: "outline" })}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          <ReactMarkdown>{pager.prev.title}</ReactMarkdown>
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className={buttonVariants({ variant: "outline" })}
        >
          <ReactMarkdown>{pager.next.title}</ReactMarkdown>
          <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function getPagerForDoc(doc: Doc) {
  const flattenedLinks = [null, ...flatten(docsConfig.sidebarNav), null];
  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.href
  );
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null;
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null;
  return {
    prev,
    next,
  };
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links.reduce<NavItem[]>((flat, link) => {
    return flat.concat(link.items?.length ? flatten(link.items) : link);
  }, []);
}
