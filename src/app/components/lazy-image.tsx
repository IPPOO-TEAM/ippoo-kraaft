import { useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LazyImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { loading, decoding, onLoad, className, ...rest } = props;
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true);
    onLoad?.(e);
  };

  return (
    <ImageWithFallback
      {...rest}
      onLoad={handleLoad}
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} bg-[var(--ipk-surface)]`}
    />
  );
}
