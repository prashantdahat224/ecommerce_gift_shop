import { useEffect, useRef, useState } from "react";
import LazyImage from "../placeHolder/lazyImage";
import { useNavigate } from "react-router-dom";
import OfferPosterPlcehoder from "../placeHolder/OfferPosterPlaceholder";

const OfferPoster = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/.netlify/functions/get-offers");
        const data = await res.json();
        console.log("Offers response:", data);
        setOffers(Array.isArray(data) ? data : []);// setOffers(data || []);
       } catch (error) {
        console.error("Error fetching offers:", error.message);
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  if (loading) return <OfferPosterPlcehoder />;
  if (offers.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
      >
        {Array.isArray(offers) && offers.map((offer) => ( //offers.map((offer) 
          <div key={offer.id} className="flex-shrink-0 w-full snap-center">
            <div
              onClick={() =>
                offer.product_id && navigate(`/product/${offer.product_id}`)
              }
              className="w-full h-40 cursor-pointer"
            >
              <LazyImage
                src={offer.image_url}
                alt={offer.id || ""}
                className="w-full h-40 object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-1 space-x-2">
        {Array.isArray(offers) && offers.map((_, idx) => ( //offers.map((_, idx)
          <button
            key={idx}
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: idx * sliderRef.current.offsetWidth,
                  behavior: "smooth",
                });
              }
            }}
            className={`w-1.5 h-1.5 rounded-full ${
              idx === currentIndex ? "bg-gray-900" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferPoster;