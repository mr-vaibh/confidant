"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "How is my data secured with Confidant?",
    answer:
      "All environment variables are encrypted using your public key before being stored. Only your private key, which you keep, can decrypt them. We never see or store your secrets in plain text.",
  },
  {
    question: "What if I lose my private key?",
    answer:
      "Your private key is essential for decrypting your data. If it’s lost, Confidant cannot recover your secrets. We strongly recommend backing it up securely.",
  },
  {
    question: "Can I use Confidant in CI/CD pipelines?",
    answer:
      "Absolutely. Confidant is designed to integrate smoothly with CI/CD pipelines. You can pull and decrypt your secrets using our CLI or SDK at build or runtime.",
  },
  {
    question: "Do you store my private key on your servers?",
    answer:
      "No. Your private key never leaves your device. Confidant stores only your public key to encrypt secrets. This ensures maximum security and zero-trust architecture.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, we offer a generous free tier that includes all core features to get you started. You can upgrade anytime for advanced controls, team features, and more.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            FAQs
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            Everything you need to know before getting started with Confidant.
          </p>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-left text-base md:text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
