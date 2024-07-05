```mermaid
sequenceDiagram
    Client->>Server:HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    Server-->>Client:Provides the HTML of the page
    Client->>Server:HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    Server-->>Client:Provides the CSS file
    Client->>Server:HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    Server-->>Client:Provides the JS file
    Note over Client: The Browser starst executing the JS file<br/>that request the JSON data from de Server
    Client->>Server:HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    Server-->>Client:data.json[{...},{...},{...},...]
    Note over Client:The Browser runs the event handler that displays the notes
```