import { useState } from "react";
import { cn } from "~/util/cn";

const QuestionImage = ({
  className,
  alt,
  ...props
}: React.ComponentProps<"img">) => {
  const [imageZoomed, setImageZoomed] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn(
        "relative mx-auto max-h-96 w-3/4 rounded-lg object-contain transition-all duration-300",
        imageZoomed && "z-10 w-full scale-105",
        className,
      )}
      alt={alt ?? "image"}
      onClick={() => setImageZoomed((prev) => !prev)}
      {...props}
    />
  );
};

export default QuestionImage;
