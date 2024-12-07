import { Button } from "@/components/ui/button";
import { reportCategories } from "@/data/reportCategories";
import { Link } from "react-router-dom";

const ReportSidebar = () => {
  return (
    <aside className="border rounded-lg sticky top-5 h-[50vh] overflow-y-auto">
      <ul>
        {reportCategories.map((category, index) => (
          <>
            <li key={category.title}>
              <Button
                asChild
                variant="link"
                className="text-md hover:no-underline hover:text-neutral-800 font-normal text-neutral-800"
              >
                <Link to={category.link}>
                  <category.icon className="inline-block mr-2 text-neutral-400" />
                  {category.title}
                </Link>
              </Button>
            </li>
            {index === 0 && (
              <li className="my-2 px-4">
                <span className="block text-sm text-neutral-400 font-semibold uppercase mt-1">
                  Report Categories
                </span>
              </li>
            )}
          </>
        ))}
      </ul>
    </aside>
  );
};

export default ReportSidebar;
