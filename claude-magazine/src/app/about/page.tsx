import type { Metadata } from "next";
import { SITE_CONFIG, ALL_SERIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE_CONFIG.fullName} — ${SITE_CONFIG.description}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          About
        </h1>
        <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
          스포츠 라이프스타일 콘텐츠 스튜디오
        </p>
      </header>

      <div className="space-y-8 text-lg leading-relaxed text-foreground/90">
        <p>
          <strong>크리에이터후드(Creatorhood)</strong>는 운동하는 사람들의
          입체적인 삶을 다루는 미디어입니다. 운동에서 배운 몰입의 에너지를 삶
          전반에 적용하는 사람들의 이야기를 담습니다.
        </p>

        <p>
          &quot;스포츠판 메디치&quot;를 지향하며, 크로스핏과 기능성 피트니스를 중심으로
          스포츠, 라이프스타일, 문화가 교차하는 콘텐츠를 만듭니다.
        </p>
      </div>

      {/* Series showcase */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Our Series</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ALL_SERIES.map((series) => (
            <Link
              key={series.slug}
              href={`/series/${series.slug}`}
              className="group flex items-start gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md"
            >
              <div
                className="mt-1 h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: series.color }}
              />
              <div>
                <h3 className="font-semibold group-hover:text-primary/80 transition-colors">
                  {series.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {series.description}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {series.defaultContentType}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Team</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "정수현", role: "대표 / 기획", desc: "전략, 기획, 경영 전반" },
            { name: "김지운", role: "콘텐츠 PD", desc: "영상 촬영, 편집 총괄" },
            { name: "임우석", role: "디자이너", desc: "그래픽, 썸네일, Visual Hook" },
            { name: "임용", role: "에디터", desc: "에디토리얼, 큐레이션" },
          ].map((member) => (
            <div key={member.name} className="rounded-xl border p-5">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <p className="mt-1 text-sm text-muted-foreground">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mt-16 rounded-xl border bg-card p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Contact</h2>
        <p className="text-muted-foreground mb-4">
          협업, 제안, 문의는 아래로 연락해주세요.
        </p>
        <div className="flex flex-col items-center gap-2 text-sm">
          <a
            href="https://instagram.com/creatorhood.mag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Instagram: {SITE_CONFIG.instagram}
          </a>
        </div>
      </section>
    </div>
  );
}
