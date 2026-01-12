import Card from "./ScrollingCard";
import CustomIcon from "./CustomIcon";


const Left = () => {
  const imageUrl =
    "https://media.licdn.com/dms/image/v2/D4D03AQFc1y6Fk85qdA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1671543362114?e=2147483647&v=beta&t=Esc2JnFUOiij8_dtjPMRLyDC1nKerGpt9hS3ni78uic";

  const reviews = [
    {
      name: "Amit Sharma",
      designation: "Frontend Developer",
      image: imageUrl,
      description:
        "A passionate developer focusing on creating seamless user experiences with React and Angular you can check.",
    },
    {
      name: "Ravi Singh",
      designation: "Backend Developer",
      image: imageUrl,
      description:
        "Experienced in building scalable and efficient server-side applications using Node.js and Express you can check.",
    },
    {
      name: "Priya Verma",
      designation: "UI/UX Designer",
      image: imageUrl,
      description:
        "Creative designer focused on creating visually appealing and user-friendly web and mobile interfaces.",
    },
    {
      name: "Manoj Yadav",
      designation: "Full Stack Developer",
      image: imageUrl,
      description:
        "Specialized in both frontend and backend technologies to build end-to-end web applications. web and mobile interfaces.",
    },
  ];

  return (
    <div className="bg-thinBlack flex flex-col rounded-lg md:max-w-[50%] m-5 p-5 justify-evenly gap-5 pb-0">
      <CustomIcon />
      <div>
        <h1 className="text-2xl font-bold pb-3">
          Let us help you run your freelance business.
        </h1>
        <p className="opacity-60">
          Our registration process is quick and it would take less than a
          minutes.
        </p>
      </div>
      <Card reviews={reviews} />
      {/* <CardCopy reviews={reviews} /> */}
    </div>
  );
};

export default Left;
