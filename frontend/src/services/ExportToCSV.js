import { saveAs } from 'file-saver';

function exportToCSV(quotes, startDate, endDate) {
  const filteredQuotes = quotes.filter(quote => {
    const quoteDate = new Date(quote.dateTime);
    return quoteDate >= startDate && quoteDate <= endDate;
  });

  const headers = ['DateTime', 'Open Price', 'High Price', 'Low Price', 'Close Price'];
  const rows = filteredQuotes.map(quote => [
    new Date(quote.dateTime).toISOString(),
    quote.open_price,
    quote.high_price,
    quote.low_price,
    quote.close_price,
  ]);

  let csvContent = '';
  csvContent += headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });


  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'currentQuotes.csv');
}

export default exportToCSV;
