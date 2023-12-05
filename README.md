Tab Search is a practical web extension designed to simplify tab management in your browser. This Safari extension introduces a fuzzy search function that helps you find tabs quickly, even when you can't quite remember the exact title.

Features:

- Fuzzy Search: Effortlessly locate tabs with titles that are hard to recall using a smart fuzzy search algorithm.
- Visual Matching: As you type, see the characters that match your search criteria, making the process more intuitive.

How to build:

- Use XCode to generate a Safari App Extension project
- Clone this repo and `pnpm i`
- Build the project `pnpm build`
- Link all the resources from `dist/` folder to the Extension target in the XCode project
- In XCode's Product menu, select Run
