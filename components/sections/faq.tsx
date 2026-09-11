// Accordion variant follows protobox-site faq-section, with the audial-style
// 4/8 rail split kept for scannability. Two-column stays fully visible Q/A.

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeading } from "@/components/sections/shared"
import type { FaqContent } from "@/lib/sections/types"

export function FaqAccordion({ heading, intro, items }: FaqContent) {
  return (
    <section id="faq" className="section-pad border-b border-border">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading heading={heading} intro={intro} />
        <Accordion type="single" collapsible className="w-full" defaultValue="faq-0">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-heading text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export function FaqTwoColumn({ heading, intro, items }: FaqContent) {
  return (
    <section id="faq" className="section-pad border-b border-border">
      <div className="container-site">
        <SectionHeading heading={heading} intro={intro} align="center" />
        <dl className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-14 gap-y-10 sm:grid-cols-2 lg:mt-14">
          {items.map((item) => (
            <div key={item.question} className="border-t border-border pt-6">
              <dt className="font-heading text-base font-semibold">{item.question}</dt>
              <dd className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
