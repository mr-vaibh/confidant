"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server, Settings, UploadCloud, Eye } from "lucide-react";

const features = [
  {
    title: "End-to-End Encryption",
    description: "All your secrets are encrypted using RSA and only you hold the private key.",
    icon: Lock,
  },
  {
    title: "Self-hostable or Cloud",
    description: "Use our secure cloud or self-host Confidant within your own infrastructure.",
    icon: Server,
  },
  {
    title: "Granular Access Control",
    description: "Fine-grained roles & permissions so teams share only what’s needed.",
    icon: ShieldCheck,
  },
  {
    title: "Plug & Play Integration",
    description: "Drop-in SDKs for Node, Python & more. Just copy, paste, and done.",
    icon: Settings,
  },
  {
    title: "Version History",
    description: "Roll back to previous env versions in one click — never lose secrets again.",
    icon: UploadCloud,
  },
  {
    title: "Audit Logging",
    description: "Track every read and write, know exactly who accessed what.",
    icon: Eye,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-6xl px-6 md:px-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-sm mb-4 px-3 py-1 rounded-full">
            Why Confidant
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built for developers who care about security and DX
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Confidant lets you focus on code — not secret management. We handle the encryption, access control, and integrations so you don’t have to.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-sm border border-border rounded-xl hover:shadow-lg transition">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
