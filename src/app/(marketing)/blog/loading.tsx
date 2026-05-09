import { Container } from "@/components/shared/Container"
import { Section }   from "@/components/shared/Section"
import { Skeleton }  from "@/components/shared/feedback/Skeleton"

export default function BlogLoading() {
  return (
    <main>
      <div className="border-b border-border bg-card/30 py-10 md:py-14">
        <div className="container-x mx-auto max-w-7xl">
          <Skeleton className="mb-4 h-6 w-24 rounded-full" />
          <Skeleton className="mb-3 h-10 w-80" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <Section spacing="default">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
            </div>
            <Skeleton className="h-56 rounded-2xl" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
