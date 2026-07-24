import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  intro,
  children,
  className = "",
  align = "left",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section className={`mx-auto max-w-7xl px-6 py-16 md:py-20 ${className}`}>
      {(eyebrow || title || intro) && (
        <div
          className={`mb-10 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
        >
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground/80">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-semibold text-primary">
              {title}
            </h2>
          )}
          {intro && (
            <p className="mt-3 text-base text-muted-foreground">{intro}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {eyebrow}
          </div>
        )}
        <h1 className="max-w-3xl text-4xl md:text-5xl font-semibold text-primary">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {intro}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
