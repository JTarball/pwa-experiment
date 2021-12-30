


export interface Person {
    id: int = -1;
    firstName: String = "";
    lastName: String = "";
    //Address address = new Address();
    phoneNumber: String = "";
    email: String = "";
    Date: dateOfBirth = null;
    comments: String = "";
}



export interface Stock {
    id: int = -1;
    String symbol;
    String logoUrl = ""
    String companyName = "";
    String price = "";
    Number priceNumber;
    String status = "";
    int noOfAlerts = 0;
    number priceChange = 0;
    number priceChangePercent = 0;
    number priceChange1yr = 0;
    number priceChange1yrPercent = 0;
    number priceChangeSinceWatched = 0;
    number priceChangeSinceWatchedPercent = 0;
}

export interface UserStock extends Stock {
    int noOfAlerts = 0;
    Array notification_types;
}




export interface NewsArticle {
    String headline;
    String date;
    String  summary;
    String image;
    String source;
}



export const NotificationTypePush = 0
export const NotificationTypeEmail = 1
export const NotificationTypeWhatsapp = 2

export interface UserStockAlert {
    String uuid;
    String title;
    String notes;
    String help; // Help description of what the alert is 
    String info; // Either when the alert was created or when last triggered
    Array notification_types;
    Boolean enabled;
}


export interface StockInsightItem {
    String key;            // Unique parameter key e.g. peg_ratio
    String value;          // The value of the parameter e.g. 2 
    String title;          // Parameter or insight frontend title e.g. peg ratio 
    String comparison;    // A comparison e.g. peg ratio is X for this industry
    String recommendation; // Recommendation or insight based of the comparison
    String help;           // An explanation of the parameter. To provide help to the user.
    Boolean mood;          // If true it is a positive check, if false it is a negative
    String moodText;       // If not empty will be the text associated with the mood.
}


export interface TrendStat {
    String symbol;
    String logoUrl;
    String companyName;
    String price;
    String priceChange;
    String priceChangePercent;
}

export interface IPOCalendar {
    String date;
    String logoUrl;
    String symbol;
    String companyName;
    String exchange;
    String statusOfIPO;
    String numberOfShares;
    String priceRange;
    String marketCap;
}

export interface DividendCalendar {
    String symbol;
    String companyName;
    String logoUrl;
    String date;
    String dividend;
}


export interface EarningsCalendar {
    String symbol;
    String companyName;
    String logoUrl;
    String date;
    String revenue;
    String revenueEstimated;
    String eps;
    String epsEstimated;
    
}


export interface TimeLine {
    String title;
    String subtitle;
    String description;
    String url;
    Date  date;
    Boolean mood; // mood: If timeline message is a postive one, if false it is considered negative
}


// yld0 
 // notification

 // following
 // usernotifications
     // user_id
     // title
     // subtitle
     // description
     // icon
     // url 
     // date 
     // mood

// index on user_id, date 
// sort by date when graphql mongo query 