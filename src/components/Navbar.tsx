import React from "react";

const Navbar = () => {
  return (
    <nav className="max-w-6xl mx-auto">
      <div>
        <a href={"/"}>
          <div className="flex items-center gap-1">
            <div className="relative">
              <Shape />
              <BookIcon />
            </div>
            <span className="text-xl font-bold tracking-tight text-orange-400">
              eBook LIBRARY
            </span>
          </div>
        </a>
      </div>
      <div>
        <button className="h-10 rounded-xl bg-orange-400 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-500 active:bg-red-700">
          Sign in
        </button>
        <button className="h-10 rounded-xl bg-orange-400 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-500 active:bg-red-700">
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

////////// SVG

const Shape = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="45"
    viewBox="0 0 24 24"
    fill="#FF2222" // light red fill
    stroke="#FF2222" // light red stroke
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-shape"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
  </svg>
);

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#fff"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="#ce7041"
    className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);
