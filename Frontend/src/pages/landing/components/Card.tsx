import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const Card = ({ imageSrc, imageAlt, title, description }) => {
  return (
    <div className="rounded-lg overflow-hidden  shadow-lg flex flex-col">
      <div className="relative flex items-center justify-center">
        <h2 className="text-3xl w-[20ch] text-white text-center absolute font-semibold ">
          {title}
        </h2>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full aspect-auto h-40 object-cover"
        />
      </div>
      {/* Content */}
      <div className="p-7 h-full bg-[#1a976a]">
        <p className="text-white text-sm font-normal font-['Inter'] leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
};

export const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-black text-white relative rounded-2xl space-y-4 pt-12 p-8 flex flex-col items-center text-center shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ margin: "-200px" }}
    >
      {/* Icon */}
      <div className="w-20 h-20 mb-4 absolute top-[-15%] rounded-full bg-white flex items-center justify-center">
        <img src={icon} alt={`${title} Icon`} />
      </div>

      {/* Title */}
      <h2 className="text-white text-xl font-bold">{title}</h2>

      {/* Description */}
      <p className="text-white text-sm p-2 font-normal leading-7">
        {description}
      </p>
    </motion.div>
  );
};

export const LongTermValueCard = ({
  title,
  description,
  imageUrl,
  index,
  range,
  targetScale,
  progress,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["#f7fffd", "#bed9d3"] // Light green to dark green
  );
  return (
    <div
      ref={container}
      className=" flex items-center justify-center sticky top-32"
    >
      <motion.div
        style={{ scale, top: `calc(-5vh + ${index * 25}px)`, background }}
        className="w-full relative min-h-[50vh] mx-auto px-6 py-10 origin-top bg-[#f7fffd] rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6"
      >
        {/* Text Section */}
        <div className="flex flex-col justify-start items-start gap-4">
          <h2 className="text-black text-2xl md:text-4xl font-bold leading-tight">
            {title}
          </h2>
          <p className="text-black text-base font-normal leading-7">
            {description}
          </p>
        </div>

        {/* Image Section */}
        <motion.div style={{ scale: imageScale }} className="w-full max-w-xs">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-cover rounded-md"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
