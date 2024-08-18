import { cn } from "~/util/cn";

export default function BackgroundGrid({
  className,
  angle = 70,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden opacity-50 [perspective:200px]",
        className,
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "[background-repeat:repeat] [background-size:45px_45px] [height:450vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:450vw] md:[background-size:60px_60px] md:[height:300vh] md:[width:600vw]",
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_0)]",
          )}
        />
      </div>
    </div>
  );
}
