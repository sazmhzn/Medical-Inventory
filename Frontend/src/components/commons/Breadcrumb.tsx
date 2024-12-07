import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  // Split the current path into segments
  const segments = location.pathname.split("/").filter((segment) => segment);

  return (
    <nav className=" mx-auto px-4 md:px-0 max-w-7xl lg:flex-row items-center justify-center">
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="text-white hover:underline">
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const path = `/${segments.slice(0, index + 1).join("/")}`;

          return (
            <li key={path} className="flex items-center">
              <span className="mx-2 text-neutral-100">/</span>
              {isLast ? (
                <span className="text-neutral-400 capitalize">{segment}</span>
              ) : (
                <Link
                  to={path}
                  className="text-blue-600 hover:underline capitalize"
                >
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
