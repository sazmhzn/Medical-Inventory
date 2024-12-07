import Breadcrumb from "@/components/commons/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
  cardsData,
  featuresData,
  longTermValueData,
} from "@/data/landingPageData";
import { Link } from "react-router-dom";
import { Card, FeatureCard, LongTermValueCard } from "./components/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const Home = () => {
  const targetRef = useRef(null);

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
      <section className="bg-black min-h-screen">
        <div className="container mx-auto max-w-7xl overflow-hidden">
          <Breadcrumb />
          <div className=" flex flex-col lg:flex-row items-center justify-center overflow-hidden">
            {/* Text Section */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                Healthcare Inventory
                <br />
                Management Software
              </h1>
              <p className="text-[#fbae3b] text-[32px] font-bold  leading-10">
                Gain Full Visibility into
                <br />
                Healthcare Supply Chains
              </p>
              <p className="lg:px-0 px-4 text-white text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                Hospital inventory management software brings automation into
                your stock control processes and helps precisely match the
                demand for care with supply. CleverDev Software is a trusted
                healthcare solution provider with a history of delivering
                compliant software to medical providers. Let us transform your
                healthcare business with the latest technologies.
              </p>
              <div className="space-x-4">
                <Button
                  asChild
                  variant="link"
                  className="rounded-full  px-8 py-3"
                >
                  <Link
                    to="/inventory"
                    className="inline-flex items-center bg-gradient-to-r from-[#1a976a] to-[#24b566] text-white font-medium text-sm sm:text-base rounded-full hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2 lg:mt-0">
              <img
                src="/images/Cover.png"
                alt="Medical Inventory"
                className="md:w-full z-30 relative w-1/2 h-auto mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
          <img
            src="/images/bg_blur.png"
            alt="s"
            className="absolute top-0 right-0 h-full -z-0"
          />
        </div>
      </section>

      <section className="bg-white min-h-[80vh]">
        <div className="container mx-auto max-w-7xl relative">
          <div className="md:w-2/3 w-full mx-auto absolute left-[50%] translate-x-[-50%] bg-[#f0f4f6] -mt-8 rounded-3xl p-8 md:p-12">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-black text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Healthcare Inventory Management Software
              </h1>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-black text-sm sm:text-base leading-relaxed">
                Healthcare stock tracking software is a supply chain management
                solution that helps healthcare organizations monitor stock
                levels. Specialized stock management software automates
                workflows to track orders, purchases, inventories, health
                product sales, and prescriptions. From low-value items to
                high-value consumables, inventory software captures the entire
                inventory lifecycle holistically.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 gap-4">
              {[
                "Track medical equipment and supplies",
                "Improve equipment check-in and check-outs",
                "Prevent loss and shortages",
                "Get alerts & notifications when inventory goes below the defined level",
                "Monitor all inventory transactions within a single interface",
                "Efficiently manage the rotation of instruments",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 text-black text-sm sm:text-base leading-normal"
                >
                  <span className="w-2 h-2 bg-black rounded-full mt-2"></span>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white min-h-screen">
        <div className="container mx-auto  max-w-7xl relative">
          <div className="mx-auto p-6">
            <h1 className="md:w-[30ch] mx-auto text-2xl md:text-5xl font-bold text-center mb-6">
              Medical Supplies Inventory Management Software for Your Business
            </h1>
            <p className="text-lg md:w-3/6 mx-auto text-center text-muted-foreground mb-16">
              We deliver medical inventory management software to different
              groups of clients, taking into account the unique challenges of
              your business processes.
            </p>
            <div className="grid max-w-2xl mx-auto grid-cols-1 md:grid-cols-2 mb-4 gap-4">
              {cardsData
                .filter((item, index) => index < 2)
                .map((card, index) => (
                  <Card
                    key={index}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt}
                    title={card.title}
                    description={card.description}
                  />
                ))}
            </div>
            <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-3 mb-20 gap-4">
              {cardsData
                .filter((item, index) => index > 1)
                .map((card, index) => (
                  <Card
                    key={index}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt}
                    title={card.title}
                    description={card.description}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white min-h-[80vh]">
        <div className="container mx-auto max-w-7xl relative">
          <div className="flex md:flex-row flex-col gap-12">
            <div className="flex-1 space-y-4 mx-auto">
              <h1 className="w-[20ch] text-black md:text-5xl text-xl font-bold font-['Inter'] md:leading-[52px]">
                We Have a Solution for All Your Hospital Inventory Management
                Needs
              </h1>
              <p className="w-full text-black text-base font-normal font-['Inter'] leading-7">
                Take control of your medical inventory management and shift from
                manual processes to automation so you can focus on growing your
                business.
              </p>
            </div>
            <div className="grid grid-cols-1 flex-1  mb-6 gap-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                    Medication Management
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                    Medication Management
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-[#222222] text-xl font-bold font-['Inter'] leading-7 hover:dec">
                    Medication Management
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className=" min-h-[40vh] bg-white ">
        <div className="container mx-auto max-w-7xl relative pb-6">
          <div className="bg-black md:rounded-ss-[120px] md:rounded-ee-[120px] flex items-center justify-center">
            <div className="absolute z-20">
              <div className="mb-2 md:mb-12 w-full">
                <article className="px-6 py-3 bg-[#d0e6e1] rounded-[100px] shadow justify-center items-center inline-flex ">
                  <span className="text-[#1a976a] text-sm font-normal font-['Inter'] uppercase leading-[18.20px]">
                    RFID Tags
                  </span>
                </article>
              </div>
              <p className=" md:w-[75ch] text-white text-base font-normal font-['Inter'] leading-7">
                RFID tags are attached to the items being tracked to enable you
                to manage inventory with real- time updates, reduce loss, and
                optimize asset tracking through actionable insights. RFID-based
                tracking is common for expensive equipment and high-risk
                medications.
              </p>
            </div>
            <img
              src="/images/green-bg.png"
              className="relative w-full h-full md:aspect-auto aspect-video object-cover"
              alt="bg"
            />
          </div>
        </div>
      </section>

      <section className="bg-white min-h-screen">
        <div className="container mx-auto  max-w-7xl relative">
          <div className="mx-auto pb-16 p-6">
            <h1 className="md:w-[30ch] mx-auto text-2xl md:text-5xl font-bold text-center mb-6">
              Plot a Course to Connected Hospital Inventory with Our Custom
              Integrations{" "}
            </h1>
            <p className="text-lg md:w-3/6 mx-auto text-center text-muted-foreground mb-16">
              To enhance collaboration and healthcare interoperability, our
              developers integrate your clinic inventory management system with
              Electronic Health Records software, procurement management
              systems, electronic drug registers, and mobile health apps.
            </p>
            <div className="max-w-4xl mx-auto mb-4 gap-4">
              <img
                src="/images/dfdae.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="relative">
          <div className="mx-auto">
            <div className="relative bg-gradient-to-l from-[#20bb67] to-[#1a9779] rounded-tl-[80px] rounded-tr-[80px] p-8 lg:px-24 flex flex-col lg:flex-row items-center ">
              {/* Left Content: Text */}
              <div className="max-w-7xl px-4 flex-1 text-center lg:text-left text-white space-y-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  Get a helping hand with your healthcare project
                </h1>

                {/* CTA Button */}
                <div className="mt-6">
                  <Button
                    asChild
                    className="px-12 py-6 bg-gradient-to-r from-[#d1891d] to-[#fbae3b] rounded-full"
                  >
                    <Link
                      to="#contact"
                      className="inline-flex items-center text-white font-medium text-sm sm:text-base uppercase rounded-full hover:opacity-90 transition-opacity"
                    >
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Content: Image */}
              <div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0">
                <img
                  className="w-full max-w-md lg:max-w-lg object-cover"
                  src="https://via.placeholder.com/640x523"
                  alt="Healthcare Project"
                />
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
                    Our Medical Stock Management Software Development Process
                  </h1>
                  <p className="w-full text-black text-base font-normal font-['Inter'] leading-7">
                    Take control of your medical inventory management and shift
                    from manual processes to automation so you can focus on
                    growing your business.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 flex-1  mb-6 gap-6">
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Healthcare Software Consulting
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Our experts help medical organizations establish optimal
                    digital environments
                    <br />
                    for their inventory needs by advising on the technologies
                    and implementation
                    <br />
                    strategies.
                  </p>
                  <div className="w-full max-w-lg flex flex-col gap-4">
                    <ul className="list-disc list-inside text-black text-sm font-normal space-y-4">
                      <li>
                        Mapping your hospital inventory management process
                      </li>
                      <li>
                        Selecting the right set of features based on your needs
                      </li>
                      <li>Identifying the integration needs and standards</li>
                      <li>Creating an adoption strategy for your solution</li>
                      <li>Creating a design concept and prototyping</li>
                      <li>
                        Calculating TCO/ROI and estimating costs for development
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Healthcare Software Consulting
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Our experts help medical organizations establish optimal
                    digital environments
                    <br />
                    for their inventory needs by advising on the technologies
                    and implementation
                    <br />
                    strategies.
                  </p>
                  <div className="w-full max-w-lg flex flex-col gap-4">
                    <ul className="list-disc list-inside text-black text-sm font-normal space-y-4">
                      <li>
                        Mapping your hospital inventory management process
                      </li>
                      <li>
                        Selecting the right set of features based on your needs
                      </li>
                      <li>Identifying the integration needs and standards</li>
                      <li>Creating an adoption strategy for your solution</li>
                      <li>Creating a design concept and prototyping</li>
                      <li>
                        Calculating TCO/ROI and estimating costs for development
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
              <article className="flex items-start gap-6">
                <img src="/images/icon-69.svg" alt="" />

                <div className="space-y-5 py-8">
                  <h1 className="text-[#1a976a] text-xl font-bold font-['Inter'] leading-7">
                    Healthcare Software Consulting
                  </h1>
                  <p className="text-sm font-normal font-['Inter'] leading-normal">
                    Our experts help medical organizations establish optimal
                    digital environments
                    <br />
                    for their inventory needs by advising on the technologies
                    and implementation
                    <br />
                    strategies.
                  </p>
                  <div className="w-full max-w-lg flex flex-col gap-4">
                    <ul className="list-disc list-inside text-black text-sm font-normal space-y-4">
                      <li>
                        Mapping your hospital inventory management process
                      </li>
                      <li>
                        Selecting the right set of features based on your needs
                      </li>
                      <li>Identifying the integration needs and standards</li>
                      <li>Creating an adoption strategy for your solution</li>
                      <li>Creating a design concept and prototyping</li>
                      <li>
                        Calculating TCO/ROI and estimating costs for development
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="bg-white min-h-screen py-16">
        <div className="container mx-auto  max-w-7xl relative">
          <div className="mx-auto ">
            <h1 className="md:w-[30ch] mx-auto text-2xl md:text-5xl font-bold text-center mb-6">
              Advantages of Our Medical Inventory Management Software
            </h1>
            <p className="text-lg md:w-3/6 mx-auto text-center text-muted-foreground mb-16">
              We build transformative healthcare solutions that improve your
              care delivery processes and generate value from day one.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-16 mb-20">
              {featuresData.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white min-h-screen">
        <div className="container mx-auto  max-w-7xl relative">
          <div className="mx-auto relative pb-16 p-6">
            <h1 className="md:w-[30ch] mx-auto text-2xl md:text-5xl font-bold text-center mb-6">
              Why Choose CleverDev as Your Healthcare Stock Management Software
              Company?
            </h1>
            <p className="text-lg md:w-3/6 mx-auto text-center text-muted-foreground mb-16">
              CleverDev Software has deep expertise in digitizing each facet of
              healthcare value chains. Optimize your business processes and
              deliver better care by collaborating with a custom healthcare
              solution development partner.
            </p>
            <motion.div
              ref={targetRef}
              className="relative top-0 min-h-screen mx-auto mb-28 gap-4"
            >
              {longTermValueData.map((item, index) => {
                const targetScale =
                  1 - (longTermValueData.length - index) * 0.05;

                return (
                  <LongTermValueCard
                    key={index}
                    index={index}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    range={[index * 0.25, 1]}
                    progress={scrollYProgress}
                    targetScale={targetScale}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white min-h-screen relative">
        <img
          src="/images/logomark-green.svg"
          className="absolute left-0 opacity-15"
          alt=""
        />
        <img
          src="/images/logomark-green.svg"
          className="absolute right-0 top-1/2 opacity-15"
          alt=""
        />
        <div className="container mx-auto  max-w-7xl relative">
          <div className="mx-auto relative pb-16 p-6">
            <h1 className="md:w-[30ch] mx-auto text-2xl md:text-5xl font-bold text-center mb-6">
              Let’s Transform Your Business
            </h1>
            <p className="text-lg md:w-3/6 mx-auto text-center text-muted-foreground mb-16">
              Get in touch with us, and we will gladly get back to you as soon
              as possible. If you need a professional team, CleverDev Software
              will be happy to assist you in making your vision a reality.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
