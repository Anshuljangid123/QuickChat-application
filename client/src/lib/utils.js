// format msg time

// A utility function to format a given date/time into a human-readable string
export function formatMessageTime(date) {   // The function accepts a parameter `date` (timestamp, string, or Date object)

    // Convert the given input (`date`) into a JavaScript Date object
    // This ensures we can use all built-in Date methods on it
    return new Date(date).toLocaleTimeString("en-US", {  

        // `hour: "2-digit"` ensures that the hour will always be shown in 2 digits
        // For example: "03" instead of "3"
        hour: "2-digit",   

        // `minute: "2-digit"` ensures the minutes are always shown in 2 digits
        // For example: "05" instead of "5"
        minute: "2-digit",   

        // `hour12: false` means we want to use 24-hour format instead of AM/PM
        // Example: "14:30" instead of "2:30 PM"
        hour12: false  
    });
}






