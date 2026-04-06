import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("relative p-3", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "space-y-4 pt-8",

        // this is the important fix
        month_caption: "flex items-center justify-center h-7",
        caption_label: "text-sm font-medium text-[#171A22]",

        nav: "absolute left-3 right-3 top-3 z-10 flex items-center justify-between",

        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-md border border-gray-200 bg-white p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-md border border-gray-200 bg-white p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        ),

        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-md border border-gray-200 bg-white p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        ),
        nav_button_previous: "",
        nav_button_next: "",

        month_grid: "w-full border-collapse",
        table: "w-full border-collapse",

        weekdays: "flex justify-between",
        head_row: "flex justify-between w-full",

        weekday:
          "w-9 text-center rounded-md text-[0.8rem] font-normal text-muted-foreground",
        head_cell:
          "w-9 text-center rounded-md text-[0.8rem] font-normal text-muted-foreground",

        week: "mt-2 flex w-full justify-between",
        row: "mt-2 flex w-full justify-between",

        day: "h-9 w-9 p-0 text-center text-sm relative",
        cell: "relative h-9 w-9 p-0 text-center text-sm",

        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal"
        ),

        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",

        today: "bg-accent text-accent-foreground",
        day_today: "bg-accent text-accent-foreground",

        outside: "text-muted-foreground opacity-50",
        day_outside: "text-muted-foreground opacity-50",

        disabled: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",

        hidden: "invisible",
        day_hidden: "invisible",

        range_start: "day-range-start",
        day_range_start: "day-range-start",

        range_end: "day-range-end",
        day_range_end: "day-range-end",

        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", className)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", className)} {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };