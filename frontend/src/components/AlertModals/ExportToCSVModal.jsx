import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import exportToCSV from '../../services/ExportToCSV.js';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExportToCSVModal({ open, handleClose, currentQuotes }) {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const handleExport = () => {
    if (startDate && endDate) {
      if (endDate >= startDate) {
        exportToCSV(currentQuotes, startDate, endDate);
      } else {
        console.log("Error occur, choose dates correctly")
      }
    } else {
      console.log("Error, choose both dates")
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Export crypto quotes to CSV!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Choose date range:
        </DialogContentText>
        <DatePicker
          label="Start date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
        />
        <DatePicker
          label="End date"
          value={endDate}
          minDate={startDate}
          onChange={(newValue) => setEndDate(newValue)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleExport}>Export to CSV</Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
}
