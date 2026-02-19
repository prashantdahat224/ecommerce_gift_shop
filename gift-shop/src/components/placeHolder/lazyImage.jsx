import { useEffect, useRef, useState } from "react";

export default function LazyImage({ src, alt, className }) {
  const imgRef = useRef(null);

  // 🔧 CHANGE 1: initialize isLoading based on cache
  const [isLoading, setIsLoading] = useState(() => {
    const testImg = new Image();
    testImg.src = src;
    return !testImg.complete;
  });

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoading(false);
    }
  }, [src]);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {/* Skeleton */}
      {isLoading && (
        
        <div className="absolute inset-0 bg-neutral-200 animate-pulse rounded-md" >
          <div className="flex items-center justify-center h-60" >
            
            <p className=" ">Image is loading...</p>
            
            </div>
              
          </div>
           
      )}
       
       <img 
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        // 🔧 CHANGE 2: keep transition but only opacity
        className={`h-full w-full object-cover transition-opacity duration-300 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />

    </div>
  );
}
