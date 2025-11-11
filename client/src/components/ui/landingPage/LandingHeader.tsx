import { useState, type JSX } from "react";
import { LandingNavbar, LandingNavBtn, Logo } from "@ui";

export default function LandingHeader(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-midnight/95 backdrop-blur-sm shadow-md border-b border-gray-800">
      <div className="max-w-[1200px] mx-auto">
        <nav className="flex items-center justify-between px-4 py-3">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <LandingNavbar />
            <LandingNavBtn />
          </div>

          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-teal-400 hover:bg-gray-800 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round">
                  <path d="M8 8L16 16" stroke="var(--color-teal-400)" />
                  <path d="M16 8L8 16" stroke="var(--color-teal-400)" />
                  <circle
                    cx="12"
                    cy="12"
                    r="1"
                    fill="var(--color-orange-400)"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 group"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round">
                  <path d="M12 6V2" stroke="var(--color-gray-300)" />
                  <path
                    d="M12 6C8 6 4 10 4 14C4 18 8 22 12 22C16 22 20 18 20 14C20 10 16 6 12 6Z"
                    stroke="var(--color-teal-400)"
                    fill="var(--color-midnight)"
                  />
                  <circle
                    cx="18"
                    cy="10"
                    r="2"
                    fill="var(--color-orange-400)"
                    className="animate-bounce"
                    style={{
                      animationDuration: "1.5s",
                      transformOrigin: "center",
                    }}
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-4 space-y-2">
              <LandingNavbar mobile />
              <div className="mt-4">
                <LandingNavBtn fullWidth />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
