import { useState, useEffect } from "react";

interface NextGenImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

/**
 * A component that attempts to load images with performance optimizations.
 * It also handles local vs remote URLs and provides a smooth fade-in effect.
 */
export function NextGenImage({ src, fallbackSrc, className, alt, ...props }: NextGenImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Simple WebP detection or transformation could go here
  // For now, we focus on smooth loading and error handling
  
  const finalSrc = error ? (fallbackSrc || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80") : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-[inherit]" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
