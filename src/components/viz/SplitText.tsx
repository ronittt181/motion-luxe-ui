import { useEffect, useRef } from "react";

/**
 * GSAP-powered word reveal. Splits text into words and animates them
 * in on scroll with a soft mask + blur. Client-only (loads gsap lazily).
 */
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".sp-w",
          { yPercent: 108, opacity: 0, filter: "blur(8px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.05,
            delay,
            ease: "expo.out",
            stagger: 0.045,
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          },
        );
      }, ref.current!);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [delay, text]);

  return (
    <Tag ref={ref as never} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span className="sp-w inline-block will-change-transform">{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
}
