import logoPng from "../surely-placed.png";
import logo356Webp from "../surely-placed-356.webp";
import logo712Webp from "../surely-placed-712.webp";

type Props = {
  className?: string;
  priority?: boolean;
};

export function SurelyPlacedLogo({ className, priority = false }: Props) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${logo356Webp} 356w, ${logo712Webp} 712w`}
        sizes="(max-width: 640px) 178px, 220px"
      />
      <img
        src={logoPng}
        alt="SurelyPlaced logo"
        className={`h-8 w-auto sm:h-8 object-contain ${className ?? ""}`}
        width="356"
        height="126"
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

