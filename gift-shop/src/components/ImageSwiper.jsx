import { useRef, useState } from "react";
import LazyImage from "./placeHolder/lazyImage";

 

export default function ImageSwiper( {images = [], onImageClick}) {

   

  const HEIGHT = 280; // 🔧 change swiper height here (px)

  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(null);

  const [fullscreenImage, setFullscreenImage] = useState(null); // added
  
  const [open, setOpen] = useState(null); // added


  

 
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setDragging(true);
    trackRef.current.style.transition = "none";
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    const x = e.touches[0].clientX;
    const diff = x - startX.current;

    trackRef.current.style.transform =
      `translateX(${currentTranslate.current + diff}px)`;
  };

  const onTouchEnd = (e) => {
    setDragging(false);
    trackRef.current.style.transition = "transform 0.3s ease-out";

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;

    let newIndex = index;

    if (diff < -80 && index < images.length - 1) newIndex++;
    if (diff > 80 && index > 0) newIndex--;

    setIndex(newIndex);
    currentTranslate.current = -newIndex * window.innerWidth;

    trackRef.current.style.transform =
      `translateX(${currentTranslate.current}px)`;
  };

/////////////////////////////////added
 const touchStartX = useRef(0);
const touchStartY = useRef(0);

const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX;
  touchStartY.current = e.touches[0].clientY;
};

const handleTouchEnd = (e, i) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const diffX = Math.abs(endX - touchStartX.current);
  const diffY = Math.abs(endY - touchStartY.current);

  // If finger didn't move much → treat as tap
  if (diffX < 10 && diffY < 10) {
    onImageClick(i);
  }
};
////////////////////////////////////////////added

   const colors = {  
    Gray2:"#666666" ,gray3: "#d7d7d7" ,logo_color:"#1E3226"
    };

 ///////////////////////////////// added
   
//////////////////////////////////////// added
const goPrev = () => {
  if (index > 0) {
    const newIndex = index - 1;
    setIndex(newIndex);
    currentTranslate.current = -newIndex * window.innerWidth;
    trackRef.current.style.transition = "transform 0.3s ease-out";
    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  }
};

const goNext = () => {
  if (index < images.length - 1) {
    const newIndex = index + 1;
    setIndex(newIndex);
    currentTranslate.current = -newIndex * window.innerWidth;
    trackRef.current.style.transition = "transform 0.3s ease-out";
    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  }
};



  return (
    <>
   
      <style>{`
        #swiper {
          width: 100vw;
          height: ${HEIGHT}px;  
          overflow: hidden;
          touch-action: pan-y;
          background:white;
          padding-bottom: 4px;
          
        }

         
        .swiper-track {
          display: flex;
          height: 100%;
          will-change: transform;
        }

        .slide {
          width: 100vw;
          height: 100%;
          cursor: pointer;
          flex-shrink: 0;
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
         object-position: center;
        
        }


        
#indicator {
line-height: 0;
  position: static;   /* or just remove position */
     /* spacing below the swiper */
  text-align: center; /* center dots horizontally */
}



.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.dot.active {
  width: 16px;
  border-radius: 8px;
  background: #fff;
}

#nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 24px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
}

 
#buttons{
 display:non
}


 @media (min-width: 1024px) {
    #buttons {
      display: inline-block;
    }
  }


      `}</style>
       {/* user-select: none; //
           pointer-events: none; */}

           
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
  <div id="swiper" style={{ position: "relative" }}>
        <div
          ref={trackRef}
          className="swiper-track"
          style={{ width: `${images.length * 100}vw` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((src, i) => (
            <div className="slide" key={i}>
              <LazyImage src={src}
               alt={`slide-${i}`}
              //  onTouchStart={handleTouchStart} 
              //  onTouchEnd={(e) => handleTouchEnd(e, src)} 
              //  onClick={() =>setFullscreenImage(src)} //added
               onTouchStart={handleTouchStart} 
               onTouchEnd={(e) => handleTouchEnd(e, i)} 
               onClick={() => {
                 onImageClick(i);
               // alert("clicked");
                  
               }
               } //added

                />
            </div>
          ))}
        </div>

        
          {/* Left button */}
          <div id="buttons">
  <button
    onClick={goPrev}
     style={{
      position: "absolute",
      top: "50%",
      left: "10px",
      transform: "translateY(-50%)",
      background: "rgba(0,0,0,0.5)",
      color: "#fff",
      border: "none",
      fontSize: "24px",
      padding: "4px 13px",
      cursor: "pointer",
      borderRadius: "50%"
    }}
  >
    &lt;
  </button>

  {/* Right button */}
  <button
    onClick={goNext}
     style={{
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      background: "rgba(0,0,0,0.5)",
      color: "#fff",
      border: "none",
      fontSize: "24px",
      padding: "4px 13px",
      cursor: "pointer",
      borderRadius: "50%"
    }}
  >
    &gt;
  </button>
</div>
         
 
      </div>
         

          {/* Left button */}
     
      {/* Right button */}
     

         

      <div id="indicator"
        >
  {images.map((_, i) => (
      <span
        key={i}
        style={{
          width: i === index ? 12 : 6,
          height: 6,
          borderRadius: i === index ? 8 : 3,
          background: i === index ? "black" : "gray",
          transition: "all 0.3s",
          display: "inline-block",
          margin: "0 3px",
        }}
      />


  ))}
      </div>

      
   <div>
    
    

   </div>
     
</div>
 
 {/* Fullscreen Overlay */}
       {/* Fullscreen modal */}
      {/* <FullSizeImage url={fullscreenImage} onClose={() => setFullscreenImage(null)} />
     */}
     
    </>
  );
}
