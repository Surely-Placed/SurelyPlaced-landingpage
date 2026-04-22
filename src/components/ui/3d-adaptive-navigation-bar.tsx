import { useState } from "react";
import { scrollToElementById } from "@/lib/safe-scroll";

interface NavItem {
  label: string;
  id: string;
}

/**
 * 3D-style Adaptive Navigation Pill (CSS-only version)
 * Smooth hover expansion and smooth-scroll navigation to sections.
 */
export const PillBase: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [expanded, setExpanded] = useState(false);

  const navItems: NavItem[] = [
    { label: "Home", id: "home" },
    { label: "Why SurelyPlaced", id: "benefits" },
    { label: "Programs", id: "programs" },
    { label: "Contact", id: "lead" },
  ];

  const scrollToSection = (sectionId: string) => {
    scrollToElementById(sectionId);
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
    setExpanded(false);
  };

  const activeItem = navItems.find((item) => item.id === activeSection);

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="relative rounded-full transition-all duration-300"
      style={{
        width: expanded ? 560 : 140,
        height: 56,
        background:
          "linear-gradient(135deg,#fcfcfd 0%,#f8f8fa 15%,#f3f4f6 30%,#eeeff2 45%,#e9eaed 60%,#e4e5e8 75%,#dee0e3 90%,#e2e3e6 100%)",
        boxShadow:
          "0 3px 6px rgba(0,0,0,0.12),0 8px 16px rgba(0,0,0,0.1),0 16px 32px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.12),inset 0 2px 1px rgba(255,255,255,0.7),inset 0 -2px 6px rgba(0,0,0,0.1),inset 2px 2px 8px rgba(0,0,0,0.08),inset -2px 2px 8px rgba(0,0,0,0.07),inset 0 0 1px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}
    >
      {/* decorative layers omitted for brevity in explanation; kept from original */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none rounded-t-full"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 5%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0.95) 95%, rgba(255, 255, 255, 0) 100%)",
          filter: "blur(0.3px)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 pointer-events-none rounded-full"
        style={{
          height: "55%",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0) 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: expanded ? "18%" : "15%",
          top: "16%",
          width: expanded ? "140px" : "60px",
          height: "14px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.35) 40%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 100%)",
          filter: "blur(4px)",
          transform: "rotate(-12deg)",
          transition: "all 0.3s ease",
        }}
      />
      {expanded && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            right: "22%",
            top: "20%",
            width: "80px",
            height: "10px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)",
            filter: "blur(3px)",
            transform: "rotate(8deg)",
          }}
        />
      )}
      {expanded && (
        <div
          className="absolute inset-y-0 left-0 pointer-events-none rounded-l-full"
          style={{
            width: "35%",
            background:
              "linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0.03) 70%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
      )}
      {expanded && (
        <div
          className="absolute inset-y-0 right-0 pointer-events-none rounded-r-full"
          style={{
            width: "35%",
            background:
              "linear-gradient(270deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.02) 70%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      )}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none rounded-b-full"
        style={{
          height: "50%",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.08) 25%, rgba(0, 0, 0, 0.03) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none rounded-b-full"
        style={{
          height: "20%",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          boxShadow: "inset 0 0 40px rgba(255, 255, 255, 0.22)",
          opacity: 0.7,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          boxShadow: "inset 0 0 0 0.5px rgba(0, 0, 0, 0.1)",
        }}
      />

      <div
        className="relative z-10 flex h-full items-center justify-center px-6"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "SF Pro", Poppins, sans-serif',
        }}
      >
        {!expanded && activeItem && (
          <span className="text-sm font-semibold text-slate-900">
            {activeItem.label}
          </span>
        )}

        {expanded && (
          <div className="flex w-full items-center justify-evenly">
            {navItems.map((item) => {
              const isActive = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionClick(item.id)}
                  className={`relative cursor-pointer rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-white/80 text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

