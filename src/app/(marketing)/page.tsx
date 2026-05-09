import type { Metadata } from "next"

import { createMetadata } from "@/lib/metadata"
import { siteConfig } from "@/config/site"
import { BenefitsSection } from "@/components/home/BenefitsSection"
import { BlogPreview }     from "@/components/home/BlogPreview"
import { CTASection }      from "@/components/home/CTASection"
import { FAQSection }      from "@/components/home/FAQSection"
import { HeroSection }     from "@/components/home/HeroSection"
import { StatsSection }    from "@/components/home/StatsSection"
import { ToolsPreview }    from "@/components/home/ToolsPreview"

export const metadata: Metadata = createMetadata({
  title:       siteConfig.tagline,
  description: siteConfig.description,
  keywords: [
    ...siteConfig.keywords,
    "ferramentas online gratuitas",
    "calculadoras online",
    "conversor de unidades",
    "blog de tecnologia",
    "utilitários para desenvolvedores",
  ],
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsPreview />
      <BlogPreview />
      <BenefitsSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
