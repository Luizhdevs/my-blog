import { Container } from "@/components/shared/Container"
import { Section }   from "@/components/shared/Section"
import { Skeleton }  from "@/components/shared/feedback/Skeleton"

export default function PostLoading() {
  return (
    <main>
      {/* Header skeleton */}
      <div className="border-b border-border bg-card/50 py-10 md:py-14">
        <div className="container-x mx-auto max-w-5xl">
          <Skeleton className="mb-6 h-3 w-48" />
          <Skeleton className="mb-4 h-5 w-20 rounded-full" />
          <Skeleton className="mb-4 h-10 w-full max-w-xl" />
          <Skeleton className="mb-4 h-10 w-3/4 max-w-lg" />
          <Skeleton className="mb-6 h-5 w-full max-w-md" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      <Section spacing="default">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_260px]">
            <div className="flex flex-col gap-5">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="mt-4 h-8 w-48" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="mt-4 h-40 w-full rounded-xl" />
            </div>
            <div className="hidden lg:block">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
