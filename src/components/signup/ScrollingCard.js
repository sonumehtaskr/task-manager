import { RiDoubleQuotesL } from "react-icons/ri";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Card = (props) => {
    const { reviews } = props;

    const scrollSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        appendDots: (dots) => (
            <div style={{ position: "relative", width: "full" }}>
                <ul style={{ position: "absolute", top: "-1px", left: "50%", transform: "translate(-50%, 0)",display:"flex" }}>
                    {dots}
                </ul>
            </div>
        )
    };

    const reviewDetails = (review) => {
        const { image, name, designation, description } = review;

        return (
            <>
                <p>{description}</p>
                <div className="flex flex-row items-center gap-3 pt-2">
                    <img src={image} alt="profile" className="rounded-full w-7 h-7" />
                    <div>
                        <h2 className="text-sm">{name}</h2>
                        <p className="text-xs opacity-50">{designation}</p>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="bg-darkBlack text-white flex flex-col p-5 pt-8 rounded-lg relative mb-6 w-full">
            <div className="absolute  text-7xl -top-6 opacity-40 -left-1">
                <RiDoubleQuotesL />
            </div>
            <div className="slider-container">
                <Slider {...scrollSettings}>
                    {reviews.map((review, index) => (
                        <div key={index} className="relative">{reviewDetails(review)}</div>
                    ))}
                </Slider>
            </div>

        </div>
    )
}

export default Card;