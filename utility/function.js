function formatDateTime(dateString) {
    const date = new Date(dateString);
  
    // Format the date (e.g., "04 December 2024")
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero for single-digit dates
    const month = date.toLocaleString('en-US', { month: 'long' }); // Full month name
    const year = date.getFullYear();
  
    // Format the time (e.g., "12:00 AM")
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  
    // Format the final string
    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${hours}:${minutes} ${period} IST`;
  
    return `${formattedDate}, ${formattedTime}`;
  }
  
  // Example Usage
  const formatted = formatDateTime('Wed Dec 04 2024 00:00:00 GMT+0530 (India Standard Time)');
  console.log(formatted); // Output: "04 December 2024, 12:00 AM IST"
  