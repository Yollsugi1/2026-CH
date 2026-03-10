import type { Metadata } from "next";
import { searchPosts } from "@/lib/notion/database";
import { ContentGrid } from "@/components/grid/content-grid";
import { SearchForm } from "@/components/search/search-form";

export const metadata: Metadata = {
  title: "Search",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let results: Awaited<ReturnType<typeof searchPosts>> | undefined;
  if (query) {
    try {
      results = await searchPosts(query);
    } catch {
      results = [];
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Search</h1>
        <SearchForm initialQuery={query} />
      </header>

      {query && results !== undefined && (
        <section>
          <p className="mb-6 text-sm text-muted-foreground">
            &quot;{query}&quot; 검색 결과: {results.length}개
          </p>
          <ContentGrid posts={results} />
          {results.length === 0 && (
            <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          )}
        </section>
      )}

      {!query && (
        <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
          검색어를 입력하세요.
        </div>
      )}
    </div>
  );
}
