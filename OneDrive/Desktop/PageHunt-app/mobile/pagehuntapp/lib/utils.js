// utils file for the date system in the app , that shows when the post is been created


// this function will convert the createdAt to this format = "August 2025"
// things are needed -> date , month -> short , year

export function formatMemberSince(dateString){
       const date = new Date(dateString);

       // toLocaleString -> convert date and time into a string

       const month = date.toLocaleString("default" , {month : "short"});

       const year = date.getFullYear();

       return `${month}  ${year}`; 
}

// function will convert the createdAt to this format -> "August 14 , 2025"
// things are needed -> date , day , month -> long , year 

export function formatPublishDate(dateString) {
       const date = new Date(dateString);

       const day = date.getDate();

       const month = date.toLocaleString("default" , {month : "long"});

       const year = date.getFullYear();

       return `${month} ${day} , ${year}`;
}



