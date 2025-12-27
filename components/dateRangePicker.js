import React, { useContext, useState, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { SettingsContext } from "../contexts/useSettingsContext";
import dateFormat from 'dateformat';

// Helper to convert string (yyyy-mm-dd) to Date
const toDate = (val) => val ? new Date(val) : null;
// Helper to convert Date to string (yyyy-mm-dd)
const toStr = (val) => val ? dateFormat(val, "yyyy-mm-dd") : null;

const DateRangePicker = () => {
    const { setDateSelect, dateSelect } = useContext(SettingsContext);

    // Always keep value as Date objects for the picker
    const [value, setValue] = useState({
        startDate: toDate(dateSelect.start),
        endDate: toDate(dateSelect.end)
    });

    // Sync with context changes
    useEffect(() => {
        setValue({
            startDate: toDate(dateSelect.start),
            endDate: toDate(dateSelect.end)
        });
    }, [dateSelect]);

    const yr = new Date().getFullYear();
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const handleValueChange = (newValue) => {
        setValue(newValue);
        setDateSelect({
            ...dateSelect,
            start: toStr(newValue.startDate),
            end: toStr(newValue.endDate)
        });
    };

    return (
        <Datepicker
            inputClassName='border border-[var(--rock-blue)]/50 text-sm/6 p-1.5 px-2 rounded-xl text-[var(--port-gore)] w-60
             focus:outline-none cursor-pointer z-0 bg-white shadow-sm hover:border-[var(--endeavour)] transition-colors'
            useRange={false}
            value={value}
            onChange={handleValueChange}
            displayFormat={"DD-MMM-YY"}
            placeholder="Select range"
            showShortcuts={true}
            readOnly={true}
            configs={{
                shortcuts: {
                    customToday: {
                        text: "Today",
                        period: {
                            start: today,
                            end: today
                        }
                    },
                    customMonth: {
                        text: "This month",
                        period: {
                            start: firstDayOfMonth,
                            end: lastDayOfMonth
                        }
                    },
                    custom: {
                        text: "This year",
                        period: {
                            start: new Date(`${yr}-01-01`),
                            end: new Date(`${yr}-12-31`)
                        },
                    },
                    custom1: {
                        text: "Last year",
                        period: {
                            start: new Date(`${yr - 1}-01-01`),
                            end: new Date(`${yr - 1}-12-31`)
                        },
                    },
                }
            }}
            containerClassName="z-[9999] relative"
        />
    );
};

export default DateRangePicker;
