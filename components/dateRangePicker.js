import React, { useContext, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { SettingsContext } from "../contexts/useSettingsContext";
import dateFormat from 'dateformat';

const DateRangePicker = () => {

    const { setDateSelect, dateSelect } = useContext(SettingsContext);

    const [value, setValue] = useState({
        startDate: dateSelect.start,
        endDate: dateSelect.end
    });

    const yr = new Date().getFullYear();

    const handleValueChange = (newValue) => {
        // Normalize for shortcut values that may use 'start'/'end' instead of 'startDate'/'endDate'
        const normalized = {
            startDate: newValue.startDate || newValue.start || null,
            endDate: newValue.endDate || newValue.end || null
        };
        setValue(normalized);

        setDateSelect({
            ...dateSelect,
            start: normalized.startDate,
            end: normalized.endDate
        });
    }

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
            //    primaryColor={"indigo"}
            readOnly={true}
            configs={{
                shortcuts: {
                    today: "Today",
                    currentMonth: "This month",
                    custom: {
                        text: "This year",
                        period: {
                            start: `${yr}-01-01`,
                            end: `${yr}-12-31`
                        },
                    },
                    custom1: {
                        text: "Last year",
                        period: {
                            start: `${yr - 1}-01-01`,
                            end: `${yr - 1}-12-31`
                        },
                    },
                }
            }}
            containerClassName="z-20 relative"
        />

    );
};
export default DateRangePicker;
