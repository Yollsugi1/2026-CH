import { getPosts } from "@/lib/notion/database";
import { isNotionConfigured } from "@/lib/notion/client";
import { ContentGrid } from "@/components/grid/content-grid";
import { ContentCard } from "@/components/cards/content-card";

export const revalidate = 300; // ISR: 5 minutes

export default async function HomePage() {
  let featuredPosts;
  let latestPosts;

  if (!isNotionConfigured) {
    return <PlaceholderHome />;
  }

  try {
    [featuredPosts, latestPosts] = await Promise.all([
      getPosts({ featured: true, limit: 3 }),
      getPosts({ limit: 12 }),
    ]);
  } catch {
    return <PlaceholderHome />;
  }

  const heroPost = featuredPosts[0];
  const subFeatured = featuredPosts.slice(1);
  // Remove featured posts from latest to avoid duplicates
  const featuredIds = new Set(featuredPosts.map((p) => p.id));
  const filteredLatest = latestPosts.filter((p) => !featuredIds.has(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Hero Section */}
      {heroPost && (
        <section className="mb-10">
          <ContentCard post={{ ...heroPost, cardSize: "hero" }} />
          {subFeatured.length > 0 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {subFeatured.map((post) => (
                <ContentCard
                  key={post.id}
                  post={{ ...post, cardSize: "large" }}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Latest */}
      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">The Latest</h2>
        <ContentGrid posts={filteredLatest} />
      </section>
    </div>
  );
}

function PlaceholderHome() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Hero placeholder */}
      <section className="mb-10">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700">
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="mb-3 flex gap-2">
              <span className="series-badge rounded-md bg-white/20 px-2 py-0.5 text-white backdrop-blur">
                CH MAG
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white md:text-4xl">
              Creatorhood Magazine
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
              스포츠 라이프스타일 콘텐츠 스튜디오 — 운동하는 사람들의 입체적인 삶을 다루는 미디어
            </p>
          </div>
        </div>
      </section>

      {/* Setup guide */}
      <section className="rounded-xl border bg-card p-8 text-center">
        <h2 className="mb-4 text-xl font-semibold">Welcome to CH MAG</h2>
        <p className="text-muted-foreground mb-6">
          Notion 데이터베이스를 연결하면 콘텐츠가 여기에 표시됩니다.
        </p>
        <div className="mx-auto max-w-md text-left text-sm text-muted-foreground space-y-2">
          <p>1. Notion에서 &quot;CH Magazine Posts&quot; 데이터베이스를 생성하세요</p>
          <p>2. Notion Integration을 만들고 DB에 연결하세요</p>
          <p>3. <code className="bg-muted rounded px-1">.env.local</code>에 NOTION_TOKEN과 NOTION_DATABASE_ID를 입력하세요</p>
          <p>4. 개발 서버를 재시작하세요</p>
        </div>
      </section>
    </div>
  );
}
