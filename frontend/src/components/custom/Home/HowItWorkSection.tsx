"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { KeyRound, LockKeyhole, DownloadCloud } from "lucide-react";

const steps = [
  {
    title: "1. Generate Keys",
    icon: KeyRound,
    description: "Use Confidant to generate your public-private key pair. Your public key is stored with us, and the private key stays with you.",
  },
  {
    title: "2. Encrypt & Store",
    icon: LockKeyhole,
    description: "All secrets are encrypted with your public key and stored securely. Only your private key can decrypt them.",
  },
  {
    title: "3. Load & Use",
    icon: DownloadCloud,
    description: "Use our SDK or CLI to pull and decrypt environment variables automatically when your app runs.",
  },
];

export default function HowItWorkSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4 text-sm">
          How It Works
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Secure. Simple. Seamless.</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-2xl h-full shadow-md hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-col items-center justify-center gap-4">
                    <div className="bg-muted p-4 rounded-full">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground px-6 pb-6 text-center">
                    {step.description}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
