import logo from "../surely-placed.png";

type Props = {
  className?: string;
};

export function SurelyPlacedLogo({ className }: Props) {
  return (
    <img
      src={logo}
      alt="SurelyPlaced logo"
      className={`h-8 w-auto sm:h-8 object-contain ${className ?? ""}`}
      loading="lazy"
    />
  );
}

