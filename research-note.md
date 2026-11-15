# Research Note — 10X CRM

## Source
**Title:** Using the Fetch API (MDN Web Docs)
**Link:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

## Search keywords
- `fetch api mdn`
- `fetch response.ok http error`
- `fetch post json content-type`

## Where I used it in the project
- `fetchClientsFromApi()` in `js/core.js` (GET with a `response.ok` check)
- the Add Client form in `js/clients.js` (POST with JSON body)
- the Delete button in `js/clients.js` (DELETE)

## Summary (Georgian)
`fetch()` ბრაუზერის ფუნქციაა, რომლითაც სერვერს მოთხოვნას ვუგზავნი, და ის Promise-ს აბრუნებს. ამიტომ მასთან `async/await` ან `.then()` გამოიყენება. დოკუმენტაციიდან გავიგე, რომ `fetch` მხოლოდ ქსელის ჩავარდნისას (მაგალითად, ინტერნეტი რომ არ არის) აბრუნებს შეცდომას, ხოლო 404 ან 500 პასუხზე ჩვეულებრივ წარმატებულად სრულდება. ამიტომ აუცილებელია `response.ok`-ის შემოწმება და `try/catch`-ის გამოყენება. POST მოთხოვნისას ვუთითებ `method: 'POST'`-ს, `Content-Type: application/json` header-ს და `body: JSON.stringify(...)`-ს. პასუხის მონაცემებს `await response.json()`-ით ვიღებ, რაც ასევე Promise-ია. ეს წყარო პირდაპირ დამეხმარა 10X CRM-ის კლიენტების ჩატვირთვისა და Retry ღილაკის ლოგიკაში.
