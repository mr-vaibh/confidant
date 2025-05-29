import Image from "next/image";
import Link from "next/link";
import Spline from "@splinetool/react-spline/next";

import { Cover } from "@/components/ui/cover";

import { Button } from "@/components/ui/button";

import Sponserbutton from "@/components/custom/Home/sponserbutton";
import { PricingSection } from "@/components/custom/Home/PricingSection";
import FeaturesSection from "@/components/custom/Home/FeaturesSection";
import HowItWorkSection from "@/components/custom/Home/HowItWorkSection";
import FAQSection from "@/components/custom/Home/FAQSection";

export default function Home() {
  return (
    <>
      {/* <Homepage /> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 container-wrapper">
        <div className=" py-5 flex flex-col items-center justify-center">
          <Sponserbutton/>
          <h1 className="text-center text-2xl font-bold  mt-4 md:mt-12 md:text-5xl">
            Store your secrets <br /> Just{" "}
            <Cover>
              <span className="dark:text-neutral-100">
                Copy, Paste &amp; Done
              </span>
            </Cover>
          </h1>
          <h1 className="mt-6 text-center text-2xl font-bold text-gray-400">
            Built With
          </h1>
          <div className="my-4 flex flex-col items-center justify-center gap-5 md:flex-row md:ml-8">
            <Image src="./nextjs.svg" height={40} width={90} alt="next js" />
            <Image src="./shadcn.svg" height={40} width={140} alt="shadcn ui" />
            <Image
              src="./tailwind.svg"
              height={40}
              width={120}
              alt="tailwind css"
            />
            <Image
              src="./aceternity.svg"
              height={40}
              width={160}
              alt="acternity ui"
            />
          </div>

          <div className="my-5 flex items-center gap-4 flex-col md:flex-row">
            <Link href="/docs/installation">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="https://linkedin.com/in/mrvaibh">
              <Button className="h-12 gap-4" variant="secondary">
                <Image
                  src="/vaibhavicon.jpg"
                  alt="Vaibhav Shukla"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                Talk to the Founder
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <Spline scene="https://prod.spline.design/WtLbdYm-Wsiv4k7T/scene.splinecode" />
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container py-6">
          <section className="overflow-hidden rounded-lg border bg-background shadow-md md:hidden md:shadow-xl">
            <Image
              src="/examples/cards-light.png"
              width={1280}
              height={1214}
              alt="Cards"
              className="block dark:hidden"
            />
            <Image
              src="/examples/cards-dark.png"
              width={1280}
              height={1214}
              alt="Cards"
              className="hidden dark:block"
            />
          </section>
          <section
            className="hidden md:block [&>div]:p-0"
            style={
              {
                "--radius": "0.75rem",
              } as React.CSSProperties
            }
          >
            <FeaturesSection />
            <HowItWorkSection />
            <PricingSection />
            <FAQSection />
          </section>
        </div>
      </div>
    </>
  );
}
