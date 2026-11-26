"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.length > 1 &&
          paths.map((path, i) => {
            const isLast = i === paths.length - 1;
            const href = `/${paths.slice(0, i + 1).join("/")}`;

            return (
              <div key={path} className="flex items-center justify-start gap-2.5">
                {!isLast ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="text-sm font-medium capitalize tracking-[-0.018em] text-signal hover:underline"
                        href={href}
                      >
                        {path}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-mist" />
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-display text-lg font-bold uppercase leading-none tracking-[-0.02em] text-ink">
                      {path}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </div>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
