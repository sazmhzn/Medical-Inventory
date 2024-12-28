const About = () => {
  return (
    <>
      <section className="min-h-screen overflow-hidden bg-white relative">
        <img
          className="w-full scale-105 absolute -top-32 left-0 z-10"
          src="images/about-banner.png"
          alt="Placeholder"
        />
        <div className="container mx-auto max-w-7xl overflow-hidden">
          <div className="w-full relative z-30 min-h-screen px-8 md:px-20 lg:px-32 xl:px-40 py-16  flex flex-col items-center gap-10">
            {/* <div className="w-full h-20 bg-gradient-to-b from-black via-white to-white"></div> */}
            <div className="w-full text-center py-10 relative z-30">
              <h1 className="text-white text-center  text-[80px] font-bold font-['Inter'] leading-[80px] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Let's Start Your Business
                <br />
                Transformation Together
              </h1>
            </div>
            <div className="w-full max-w-lg bg-[#1a976a] rounded-tl-[2rem] rounded-br-[2rem] p-8 text-white">
              <p className="text-sm md:text-base leading-6">
                CleverDevSoftware is about partnership, reliability, and finding
                the right solutions together.
              </p>
              <p className="mt-4 text-sm md:text-base leading-6">
                With years of expertise, we’re ready to take on new projects and
                offer full-cycle custom software development services to your
                business.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <button className="text-[#fbae3b] text-sm md:text-base uppercase">
                  Contact us
                </button>
                <img
                  className="w-6 h-6 transform rotate-180"
                  src="https://via.placeholder.com/24x24"
                  alt="Arrow Icon"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen overflow-hidden relative">
        <img
          src="/images/about-gradient.png"
          alt="img"
          className="absolute w-3/4 left-36 top-0 scale-150"
        />
        <div className="container mx-auto max-w-7xl overflow-hidden">
          <div className="w-full relative z-30  flex flex-col items-center gap-10">
            <div className="w-full min-h-[100vh] py-8 lg:pt-20  flex flex-col gap-20 items-center lg:flex-row">
              {/* Left Section */}
              <div className="lg:w-1/2 w-full text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Mission
                </h1>
                <p className="text-sm md:text-base leading-6 mb-6">
                  At CleverDev Software, we specialize in creating custom
                  solutions and business automation services for small and
                  mid-sized businesses. We achieve the perfect balance of the
                  latest technological innovations and time-proven practices to
                  ensure our clients' success.
                </p>
                <p className="text-sm md:text-base leading-6 mb-6">
                  We work with companies from various industries and strive to
                  meet their software development and business automation
                  demands. We provide businesses with our dedicated support and
                  energy throughout every stage of our cooperation.
                </p>
                <p className="text-sm md:text-base leading-6 mb-6">
                  The key to CleverDev Software’s success is in our people. From
                  providing opportunities for professional development and
                  growth to creating a positive and inclusive work environment,
                  we're committed to investing in our employees' well-being. We
                  value our team because we believe that happy employees create
                  happy customers.
                </p>
                <p className="text-sm md:text-base leading-6">
                  Our inventive enthusiasm, expertise, and competence in all
                  aspects of development and automation enable us to deliver
                  streamlined customized solutions that remove barriers to our
                  clients' business growth.
                </p>
              </div>

              {/* Right Section */}
              <div className="lg:w-1/2 bg-red-300 min-h-screen py-8 w-full">
                <img
                  className="w-full h-auto object-contain"
                  src="https://via.placeholder.com/960x722"
                  alt="Mission Image"
                />
              </div>
            </div>

            <div className="w-full min-h-[90vh] py-8 lg:pb-20 flex flex-col gap-20 items-center lg:flex-row">
              {/* Left Section */}
              <div className="lg:w-1/2 py-8 w-full">
                <img
                  className="w-full h-auto object-cover"
                  src="https://via.placeholder.com/960x722"
                  alt="Mission Image"
                />
              </div>

              {/* Right Section */}
              <div className="lg:w-1/2 w-full text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Vision
                </h1>
                <p className="text-sm md:text-base leading-6 mb-6">
                  We are a successful software development and business
                  automation company creating quality solutions, always with
                  actual client needs in mind.
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Our Values
                </h1>
                <ul className="text-sm md:text-base leading-6 mb-6">
                  <li>
                    Fostering respect and commitment within the company Striving
                    for quality, transparency, and diligence at all levels
                  </li>
                  <li>
                    Customer centricity at the heart of all processes
                    Cultivating accountability and integrity with aligned team
                    vision
                  </li>
                  <li>
                    Delivering unsurpassed value to customers Putting people
                    over processes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
