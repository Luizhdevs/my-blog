import { Container } from "@/components/shared/Container"
import { Section } from "@/components/shared/Section"
import { Skeleton } from "@/components/shared/feedback/Skeleton"

export default function Loading() {
  return (
    <main>
      <Section spacing="sm" className="border-b border-border bg-card/30">
        <Container>
          <Skeleton className="mb-4 h-6 w-28 rounded-full" />
          <Skeleton className="mb-3 h-10 w-72" />
          <Skeleton className="h-5 w-80" />
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-12 w-full max-w-lg rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-xl" />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
