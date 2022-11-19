### To Use
Scraper requires a json config of the pages to scrape as well as the alert settings.
Drop a config.json in /src and adhere to this schema.

Config schema:
```
{
    "pages": [
        {            
            "name": "friendly_name_of_page",
            "url": "page_url",
            "requestFrequency": 120000,
            "pointsOfInterest": [
                {
                    "name": "friendly_name_of_POI",
                    "selector": "css_selector_for_POI_html_element",
                    "notificationType" : 1
                }
            ]
        }
    ],
    "notifications": {
        "sender": "sender_email",
        "senderPassword": "sender_email_password",
        "receiver": "reviever_email"
    }
}
```

To run: `npm i && npm start`

There are 3 notification types. Found (0), Not Found (1), and Changed (2). This determines how the scraper will alert.
For instance, should the scraper alert if it found the desired html element or if it was unable to find it.
