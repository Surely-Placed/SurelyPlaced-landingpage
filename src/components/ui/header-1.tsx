'use client';
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { SurelyPlacedLogo } from "@/components/Logo";
import { createPortal } from "react-dom";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "Why SurelyPlaced",
      href: "#benefits",
    },
    {
      label: "Programs",
      href: "#programs",
    },
    {
      label: "Testimonials",
      href: "#testimonials",
    },
    {
      label: "FAQ",
      href: "#faq",
    },
    {
      label: "Contact Us",
      href: "#home",
    },
  ];

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-white",
        {
          "bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg":
            scrolled,
        },
      )}
    >
      <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2">
          <SurelyPlacedLogo className="h-16 w-auto sm:h-18" />
        </a>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          {/* <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button> */}
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>
      <MobileMenu open={open} className="flex flex-col justify-between gap-2">
        <div className="grid gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full bg-transparent">
            Sign In
          </Button>
          <Button className="w-full">Get Started</Button>
        </div> */}
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

