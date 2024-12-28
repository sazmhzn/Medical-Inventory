import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef, useState } from "react";

const serviceSteps = [
  {
    icon: "/images/icon-69.svg",
    title: "Discovery Phase",
    description:
      "Unearth your vision. We dive deep into understanding your needs, setting the stage for a customized solution. strategies.",
  },
  {
    icon: "/images/icon-69.svg",
    title: "Requirement Analysis",
    description:
      "Define the roadmap. We gather, analyze, and document software requirements to guide the development journey.",
  },
  // Add more service steps as needed
];

const phases = [
  {
    phase: "Project Discovery Phase",
    description: "Details about the Project Discovery Phase.",
  },
  {
    phase: "Project Development Phase",
    description: "Details about the Project Development Phase.",
  },
  {
    phase: "Project Deployment Phase",
    description: "Details about the Project Deployment Phase.",
  },
  {
    phase: "Project Maintenance Phase",
    description: "Details about the Project Maintenance Phase.",
  },
  {
    phase: "Project Support Phase",
    description: "Details about the Project Support Phase.",
  },
];

const Services = () => {
  const targetRef = useRef(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0); // Default to the first phase

  const handlePhaseClick = (index) => {
    setActivePhaseIndex(index); // Update the active phase index
  };

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#FFFFFF", "#d1e6e1", "#f3dfbe"]
  );

  return (
    <>
      <section className="min-h-screen overflow-hidden bg-white relative">
        <div className="container mx-auto max-w-7xl overflow-hidden">
          <div className="w-full relative z-30 min-h-screen px-8 md:px-20 lg:px-32 xl:px-40 py-16  flex flex-col items-center gap-10">
            {/* <div className="w-full h-20 bg-gradient-to-b from-black via-white to-white"></div> */}
            <div className="w-full text-center pt-10 relative z-30">
              <h1 className=" text-center  text-[80px] font-bold font-['Inter'] leading-[80px] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                How we work
              </h1>
              <p className="lg:text-xl mt-4 font-semibold text-[#1a976a] md:text-base leading-6">
                Navigating Excellence in Software Development Collaboration
              </p>
            </div>
            <div className="w-full max-w-lg text-center rounded-tl-[2rem] rounded-br-[2rem] p-8">
              <p className="text-sm md:text-base leading-6">
                Our complete suite of custom software development process
                services is designed to support clients throughout all stages of
                the software development life cycle (SDLC), ensuring project
                success from start to finish and beyond.
              </p>
              <div className="mt-6 flex items-center gap-2 w-full justify-center ">
                <Button className="text-white rounded-full bg-[#1a976a] text-sm md:text-base uppercase">
                  Contact us
                  <img
                    className="w-6 h-6 transform rotate-180"
                    src="https://via.placeholder.com/24x24"
                    alt="Arrow Icon"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white relative">
        <div className="w-full  relative z-30 min-h-[20vh]  py-16 bg-[#1a976a] flex flex-col items-center gap-8 rounded-tl-[80px] rounded-tr-[80px]">
          <div className="py-10 max-w-7xl mx-auto flex flex-col justify-center items-center">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full ">
              {/* Left Section */}
              <div className="w-[80ch] flex flex-col justify-center">
                <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
                  Innovation-Driven Solutions by CleverDev Software
                </h1>
              </div>

              {/* Right Section */}
              <div className="flex-1">
                <p className="text-white text-sm md:text-base leading-relaxed">
                  CleverDev Software is a prominent global custom software
                  development company, driven by a passion for innovation. Our
                  expertise lies in building efficient dedicated teams and
                  providing comprehensive services across concept design,
                  requirements analysis, architecture design, technology
                  consulting, back- and front-end development, testing, product
                  extension, and support services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen overflow-hidden bg-[#1a976a] relative">
        <div className="w-full  relative z-30 min-h-[20vh]  py-16 flex flex-col items-center">
          <div className=" max-w-7xl mx-auto flex flex-col justify-center items-center">
            <div className="flex flex-col w-full rounded-xl p-20 bg-white justify-between items-start gap-8 h-full">
              {/* Left Section */}
              <h1>
                <span className="text-black text-5xl font-bold font-['Inter'] leading-[52px]">
                  Software Development
                  <br />
                  Collaboration Models{" "}
                </span>
                <span className="text-[#1a976a] text-5xl font-bold font-['Inter'] leading-[52px]">
                  We Offer
                </span>
              </h1>
              <p className="text-black text-base font-normal font-['Inter'] leading-7">
                Whether your ideas are budding or fully formed in the real
                world, we embark on a strategic journey with you,
                <br />
                driven by our commitment to partnership. Our collaborative ethos
                ensures that even the most fledgling concepts
                <br />
                receive the nurturing they need to flourish into impactful
                projects. The integrity of your intellectual property is
                <br />
                safeguarded through a Non-Disclosure Agreement (NDA), providing
                you with the reassurance of privacy.
              </p>
              <div className="flex-1 w-full mb-6 gap-6">
                <Accordion type="single" collapsible>
                  <AccordionItem className="border px-4" value="item-1">
                    <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                      Fixed Price
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border px-4" value="item-2">
                    <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                      Time & Materials
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border px-4" value="item-3">
                    <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                      BFS (Budget with Float Scope)
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border px-4" value="item-3">
                    <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                      Outstaffing
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="pl-8 py-2 border-l-2 border-[#1a976a] flex-col justify-start items-start inline-flex">
                <div className="flex-col justify-start items-start flex">
                  <div className=" text-black text-base font-normal font-['Inter'] leading-7">
                    Selecting the most fitting contract type involves a thorough
                    analysis of factors such as project size,
                    <br />
                    available documentation, unique preferences, functional
                    intricacies, and an understanding of the desired
                    <br />
                    functionality. This journey commences with the formalization
                    of an agreement via email. Progress is
                    <br />
                    quantified through agile methodologies 2-4-week sprints,
                    ensuring payment only for accepted outcomes.
                    <br />
                    Our commitment extends further, covering the bug-fixing
                    process and warranty coverage for a<br />
                    comprehensive experience. 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        ref={targetRef}
        style={{
          background,
        }}
        className="bg-white min-h-screen py-16"
      >
        <div className="container mx-auto max-w-7xl relative">
          <div className="flex md:flex-row relative h-full flex-col gap-12">
            <div className="flex-1 space-y-4 pb-56 mx-auto">
              <div className="relative h-full">
                <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-hidden">
                  <h1 className="w-[20ch] text-black md:text-5xl text-xl font-bold font-['Inter'] md:leading-[52px]">
                    Our Software Development Process Steps in Detail
                  </h1>
                  <p className="w-full text-black text-base font-normal font-['Inter'] leading-7">
                    Navigating the complexities of full-cycle software
                    development demands expertise and adaptability. As experts
                    in full life cycle software development, our comprehensive
                    range of services covers every aspect from software
                    requirements gathering to deployment. Anchored in agile
                    methodologies or, if needed, a waterfall model, our approach
                    ensures seamless adaptation to evolving business dynamics.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 flex-1  mb-6 gap-6">
              {serviceSteps.map((step, index) => (
                <article className="flex items-start gap-6">
                  <img src={step.icon} alt="" />
                  <div className="space-y-5 py-8">
                    <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                      {step.title}
                    </h1>
                    <p className="text-sm font-normal font-['Inter'] leading-normal">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Discovery Phase
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Unearth your vision. We dive deep into understanding your
                    needs, setting the stage for a customized solution.
                    <br />
                    strategies.
                  </p>
                </div>
              </article>
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Requirement Analysis
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Define the roadmap. We gather, analyze, and document
                    software requirements to guide the development journey.
                  </p>
                </div>
              </article>
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Create Design
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Craft the visual identity. Our design develop and
                    development experts create interfaces that enhance user
                    experience and functionality.
                  </p>
                </div>
              </article>
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Meticulous Development:
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Craft the visual identity. Our design develop and
                    development experts create interfaces that enhance user
                    experience and functionality.
                  </p>
                </div>
              </article>
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Create Design
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Craft the visual identity. Our design develop and
                    development experts create interfaces that enhance user
                    experience and functionality.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="bg-white min-h-screen">
        <div className="container mx-auto max-w-7xl relative ">
          <div className="flex  md:flex-row flex-col gap-12">
            <div className="h-auto py-8 min-h-screen flex flex-col justify-center items-start gap-6">
              {phases.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => handlePhaseClick(index)}
                >
                  {/* Circle Indicator */}
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      activePhaseIndex === index
                        ? "border-[#1a976a] bg-[#1a976a]"
                        : "border-black/30 bg-transparent"
                    }`}
                  ></div>

                  {/* Phase Text */}
                  <div>
                    <span
                      className={`text-[28px] md:text-[32px] font-semibold ${
                        activePhaseIndex === index
                          ? "text-[#1a976a]"
                          : "text-black/30"
                      }`}
                    >
                      {item.phase}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Content of the Active Phase */}
            <div className="mt-6 text-lg  min-h-screen flex flex-col justify-center items-start md:text-xl text-gray-800 font-medium">
              {phases[activePhaseIndex].description}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
