import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import back from "../../assets/icon_download_back.png";
 import FullScreenLoader from "../../utils/FullScreenLoader";

 

const OfferGridPage = () => {
  const navigate = useNavigate();

  const [offer1Url, setOffer1Url] = useState(null);
  const [offer2Url, setOffer2Url] = useState(null);
  const [offer3Url, setOffer3Url] = useState(null);
  const [offer4Url, setOffer4Url] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH OFFERS =================
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .in("id", ["offer1", "offer2", "offer3", "offer4"]);

        if (error) throw error;

        data.forEach((offer) => {
          let url = offer.image_url || "";
          if (url && !url.startsWith("http")) {
            const { data: urlData } = supabase.storage
              .from("offers")
              .getPublicUrl(url);
            url = urlData.publicUrl;
          }

          if (offer.id === "offer1") setOffer1Url(url);
          if (offer.id === "offer2") setOffer2Url(url);
          if (offer.id === "offer3") setOffer3Url(url);
          if (offer.id === "offer4") setOffer4Url(url);
        });
      } catch (err) {
        console.error("Error fetching offers:", err.message);
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  return (

     <div>
              {/* HEADER */}
              <div className="sticky top-0 bg-white z-50">
                <div className="p-2 flex items-center gap-2 ml-">
                  <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                  <p className="text-lg font-bold">Offer poster Management</p>
                </div>
                <hr />
              </div>

    <div className="p-7 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Offers</h2>
      
           <p >Click on the image to update or delete or upload new</p>

             <FullScreenLoader loading={loading}
      message=" loading..."/>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Offer 1 */}
        <div
          className="cursor-pointer"
          onClick={() => navigate("/offer1")}
        >
          {offer1Url ? (
            <img
              src={offer1Url}
              alt="Offer 1"
              className="w-full h-28 object-cover rounded"
            />
          ) : (
            <div className="w-full h-28 bg-gray-200 flex items-center justify-center">
              Offer 1
            </div>
          )}
          <div>
          <p>offer number 1</p>
        </div>
        </div>

        {/* Offer 2 */}
        <div
          className="cursor-pointer"
          onClick={() => navigate("/offer2")}
        >
          {offer2Url ? (
            <img
              src={offer2Url}
              alt="Offer 2"
              className="w-full h-28 object-cover rounded"
            />
          ) : (
            <div className="w-full h-28 bg-gray-200 flex items-center justify-center">
              Offer 2
            </div>
          )}
          <p>offer number 2</p>
        </div>

        {/* Offer 3 */}
        <div
          className="cursor-pointer"
          onClick={() => navigate("/offer3")}
        >
          {offer3Url ? (
            <img
              src={offer3Url}
              alt="Offer 3"
              className="mt-4 w-full h-28 object-cover rounded"
            />
          ) : (
            <div className="mt-4  w-full h-28 bg-gray-200 flex items-center justify-center">
              Offer 3
            </div>
          )}

          <p>offer number 3</p>
        </div>

        {/* Offer 4 */}
        <div
          className="cursor-pointer"
          onClick={() => navigate("/offer4")}
        >
          {offer4Url ? (
            <img
              src={offer4Url}
              alt="Offer 4"
              className="mt-4 w-full h-28 object-cover rounded"
            />
          ) : (
            <div className=" mt-4  w-full h-28 bg-gray-200 flex items-center justify-center">
              Offer 4
            </div>
          )}
          <p>offer number 4</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OfferGridPage;