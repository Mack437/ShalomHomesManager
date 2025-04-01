import { Link, useLocation } from "wouter";

interface MobileNavProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export function MobileNav({ isOpen, closeMenu }: MobileNavProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/properties", label: "Properties" },
    { href: "/tasks", label: "Tasks" },
    { href: "/pos", label: "POS System" },
    { href: "/users", label: "Users" },
    { href: "/map", label: "Map View" },
    { href: "/form-demo", label: "Form Demo" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-gray-800 z-40 absolute inset-x-0 transition transform origin-top-right">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive(item.href)
                ? "text-white bg-gray-900"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
