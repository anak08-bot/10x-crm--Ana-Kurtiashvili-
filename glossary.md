# Glossary — 10X CRM

Ten technical terms from this project. Each entry has a one-sentence English definition and an explanation in Georgian.

---

### 1. Authentication
**EN:** Authentication is the process of checking that a user is who they claim to be, usually with an email and a password.
**KA:** ავტორიზაცია/ავთენტიფიკაცია ნიშნავს იმის შემოწმებას, რომ მომხმარებელი ნამდვილად ის არის, ვინც ამბობს. ჩემს პროექტში `index.html`-ზე ვეძებ მომხმარებელს `crm_users`-ში email-ით და ვადარებ პაროლს; თუ ემთხვევა, ვუშვებ სისტემაში.

### 2. Session
**EN:** A session is a record that shows a user is currently logged in, so they do not have to enter their password on every page.
**KA:** სესია არის ჩანაწერი იმის შესახებ, რომ მომხმარებელი ახლა შესულია სისტემაში. ჩემთან ის ინახება `crm_session`-ში (userId, email, loginAt). Auth guard ამ გასაღების არსებობას ამოწმებს, ხოლო Logout მას შლის.

### 3. Validation
**EN:** Validation is checking that the data a user enters follows the rules before the program accepts it.
**KA:** ვალიდაცია არის შეყვანილი მონაცემების შემოწმება წესების მიხედვით, სანამ პროგრამა მათ მიიღებს. მაგალითად, რეგისტრაციაზე სახელი უნდა იყოს მინიმუმ 3 სიმბოლო, ხოლო პაროლი მინიმუმ 8 სიმბოლო და შეიცავდეს ასოსა და ციფრს. შეცდომის შემთხვევაში ველის ქვეშ წითელი ტექსტი ჩნდება და მონაცემი არ ინახება.

### 4. Fetch
**EN:** `fetch` is a built-in browser function that sends an HTTP request to a server and returns a Promise with the response.
**KA:** `fetch` არის ბრაუზერის ფუნქცია, რომლითაც სერვერს ვუგზავნი მოთხოვნას და ვიღებ პასუხს. ის Promise-ს აბრუნებს, ამიტომ ვიყენებ `async/await`-ს. კლიენტების 30-კაციან სიას DummyJSON-იდან `fetch`-ით ვტვირთავ.

### 5. Endpoint
**EN:** An endpoint is a specific URL of an API that handles one kind of request.
**KA:** endpoint არის API-ის კონკრეტული მისამართი, რომელიც ერთ კონკრეტულ მოქმედებას ემსახურება. მაგალითად, `https://dummyjson.com/users?limit=30` კლიენტების სიას აბრუნებს, ხოლო `https://dummyjson.com/users/add` ახალი ჩანაწერის დასამატებლად გამოიყენება.

### 6. Request method
**EN:** A request method (GET, POST, PUT, DELETE) tells the server what kind of action the client wants to perform.
**KA:** request მეთოდი სერვერს ეუბნება, რა ტიპის მოქმედება მინდა. ჩემს პროექტში GET არის კლიენტების ჩატვირთვა, POST ახალი კლიენტის დამატება, DELETE კლიენტის წაშლა. PUT რედაქტირებისთვის არსებობს, მაგრამ ჯერ არ გამოვიყენე.

### 7. JSON
**EN:** JSON (JavaScript Object Notation) is a lightweight text format for storing and sending structured data.
**KA:** JSON არის ტექსტური ფორმატი მონაცემების შესანახად და გასაგზავნად, რომელიც JavaScript-ის ობიექტებს ჰგავს. `localStorage` მხოლოდ ტექსტს ინახავს, ამიტომ ობიექტებს `JSON.stringify()`-ით ვწერ და `JSON.parse()`-ით ვკითხულობ. API-ს პასუხსაც `response.json()`-ით ვაქცევ ობიექტად.

### 8. State
**EN:** State is the data the application keeps in memory at a given moment and uses to decide what to show on the screen.
**KA:** state არის მონაცემები, რომლებიც აპლიკაციას მეხსიერებაში უჭირავს და რომლის მიხედვითაც ეკრანი იხატება. ჩემთან მთავარი state არის `clients` მასივი. ყოველი ცვლილების შემდეგ ვაკეთებ ამ სამს: state იცვლება, ინახება `localStorage`-ში, ეკრანი თავიდან იხატება.

### 9. Event listener
**EN:** An event listener is a function that waits for a user action, such as a click or a form submit, and runs when it happens.
**KA:** event listener არის ფუნქცია, რომელიც ელოდება მომხმარებლის მოქმედებას (click, input, submit) და ამ მოქმედებისას სრულდება. მაგალითად, ფორმაზე `addEventListener('submit', ...)` ვიყენებ და შიგნით `preventDefault()`-ით ვაჩერებ გვერდის გადატვირთვას. კლიენტების ბარათებზე ერთ listener-ს ვაყენებ მთელ სიაზე (event delegation).

### 10. Deployment
**EN:** Deployment is publishing the finished application to a server so that anyone can open it through a public link.
**KA:** deployment ნიშნავს მზა აპლიკაციის ინტერნეტში გამოქვეყნებას, რომ ნებისმიერ ადამიანს ბმულით გაეხსნას. ჩემი პროექტი Vercel-ზეა განთავსებული და ბმული README-ში მაქვს.
