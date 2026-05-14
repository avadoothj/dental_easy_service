import { useState } from "react";
import moment from "moment-timezone";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { currentDate } from "@/utils/dateHelper";
import { formatDate } from "@/utils/utils";

export default function CustomDatepicker(props) {
  const [isOpen, setIsOpen] = useState(false);

  const options = {
    className: null,
    callback: () => {},
    format: "DD/MM/YYYY",
    value: currentDate(),
    minDate: moment("2023-01-01"),
    ...props,
  };

  options.value = options.value ? moment(options.value) : null;

  if (options.maxDate) {
    options.maxDate = moment(options.maxDate);
  }

  if (options.minDate) {
    options.minDate = moment(options.minDate);
  }

  const handleSelect = (eventKey) => {
    const newDate = formatDate(eventKey, 3);
    if (newDate != "-") {
      options.callback(formatDate(eventKey, 3));
    } else {
      options.callback(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        {...options}
        onChange={handleSelect}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        slotProps={{
          textField: {
            size: "small",
            readOnly: true,
            onClick: () => setIsOpen(true),
          },
        }}
      />
    </LocalizationProvider>
  );
}
