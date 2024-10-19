"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Cookies from 'js-cookie'

interface DatePickerWithRangeProps {
  className?: string;
  onDateChange: (range: DateRange | undefined) => void;
  reset?: boolean; // Prop to reset the date picker
  onResetComplete?: () => void; // Callback when reset is done
}

export function DatePickerWithRange({
  className,
  onDateChange,
  reset = false,
  onResetComplete,
}: DatePickerWithRangeProps) {

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 9, 4),
    to: addDays(new Date(2022, 9, 25), 1),
  });

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onDateChange(range); // Call the callback with the selected range
    if (range) {
      Cookies.set("selectedDateRange", JSON.stringify(range));
    }
  };

  React.useEffect(() => {
    if (reset) {
      setDate({
        from: new Date(2022, 9, 4),
        to: addDays(new Date(2022, 9, 25), 1),
      }); // Reset the date picker
      Cookies.remove("selectedDateRange"); // Remove the cookie
      if (onResetComplete) onResetComplete(); // Notify that reset is complete
    }
  }, [reset, onResetComplete]);

  React.useEffect(() => {
    const savedDate = Cookies.get("selectedDateRange")
      ? JSON.parse(Cookies.get("selectedDateRange")!)
      : null;

    if (savedDate) setDate(savedDate)
  }, [])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}