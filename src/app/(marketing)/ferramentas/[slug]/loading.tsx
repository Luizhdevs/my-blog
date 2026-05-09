import { Container } from "@/components/shared/Container"
import { Section } from "@/components/shared/Section"
import { Skeleton } from "@/components/shared/feedback/Skeleton"

export default function Loading() {
  return (
    <main>
      {/* Header skeleton */}
      <div className="border-b border-border bg-card/50 py-8">
        <div className="container-x mx-auto max-w-5xl">
          <Skeleton className="mb-5 h-4 w-52" />
          <div className="flex items-start gap-5">
            <Skeleton className="size-14 shrink-0 rounded-2xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* Form skeleton */}
      <Section spacing="default">
        <Container size="md">
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </Container>
      </Section>
    </main>
  )
}
