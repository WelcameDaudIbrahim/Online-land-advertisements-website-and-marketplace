"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn, range, UpdateQuery } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { redirect, usePathname, useSearchParams } from "next/navigation";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
const FullPagination = ({
  currentPage,
  totalPages,
  take,
  showNumbers = true,
}: {
  currentPage: number;
  totalPages?: number;
  take?: number;
  showNumbers?: boolean;
}) => {
  currentPage =
    currentPage > Math.floor(currentPage) && currentPage < currentPage + 1
      ? Math.floor(currentPage + 1)
      : currentPage;
  totalPages =
    totalPages !== undefined
      ? totalPages > Math.floor(totalPages) && totalPages < totalPages + 1
        ? Math.floor(totalPages + 1)
        : totalPages
      : undefined;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageNumbers = [];
  if (totalPages !== undefined) {
    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current page, and last page with ellipses
      if (currentPage > 2) {
        pageNumbers.push(1);
        if (currentPage > 3) {
          pageNumbers.push("...");
        }
      }

      if (currentPage === 1) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }
  }
  return (
    <div className="w-full flex px-2.5 py-1.5 items-center justify-end mt-2.5 mb-6 pr-6">
      {take && (
        <div className="flex items-center">
          <p
            className={`text-sm font-medium mr-1.5 ${
              totalPages === undefined ||
              (totalPages <= 1 && "pointer-events-none opacity-50")
            }`}
          >
            Row Per Page
          </p>
          <Select
            disabled={totalPages === undefined || totalPages <= 1}
            value={take.toString()}
            onValueChange={(val) => {
              if (typeof window !== "undefined") {
                window.location.replace(
                  UpdateQuery(
                    [{ field: "take", value: val }],
                    searchParams,
                    pathname
                  )
                );
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Row Per Page" />
            </SelectTrigger>
            <SelectContent>
              {range(10, 100, 10).map((value) => (
                <SelectItem
                  className="cursor-pointer"
                  value={value.toString()}
                  key={value}
                >
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <p
        className={`text-sm font-medium mx-3.5 ${
          totalPages === undefined ||
          (totalPages <= 1 && "pointer-events-none opacity-50")
        }`}
      >
        Page {currentPage} {showNumbers && `of ${totalPages}`}
      </p>
      <Pagination className="justify-end max-w-fit mx-1.5">
        <PaginationContent>
          <PaginationItem
            className={`${
              currentPage === 1 && "pointer-events-none opacity-50 bg-accent"
            }`}
          >
            <PaginationPrevious
              href={UpdateQuery(
                [{ field: "page", value: (currentPage - 1).toString() }],
                searchParams,
                pathname
              )}
            />
          </PaginationItem>

          {showNumbers &&
            pageNumbers.map((number, index) =>
              number === "..." ? (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem
                  key={number}
                  className={currentPage === number ? "bg-accent" : ""}
                >
                  <PaginationLink
                    href={UpdateQuery(
                      [{ field: "page", value: number.toString() }],
                      searchParams,
                      pathname
                    )}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

          <PaginationItem
            className={`${
              ((totalPages !== undefined && currentPage >= totalPages) ||
                (totalPages !== undefined && totalPages <= 1)) &&
              "pointer-events-none opacity-50 bg-accent"
            }`}
          >
            <PaginationNext
              href={UpdateQuery(
                [{ field: "page", value: (currentPage + 1).toString() }],
                searchParams,
                pathname
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  FullPagination,
};
