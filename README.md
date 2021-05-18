<a href="https://perry-olsson.github.io/javascript-calculator/" target="_blank"><h1 align="center">Javascript calculator</h1></a>

<p align="center"><b>A basic pocket style calculator with an added display for the current calculation.</b></p>

<p align="center"><b>Built with vanilla javascript.</b></p>

---

## Project Screenshot

<img src="./images/Screen Shot 2021-05-17 at 8.07.32 PM.png"/>

## Reflection

##### Inspiration

This was my first personal project and I was inspired to create it after finishing the DOM manipulation section of a udemy course I was taking. It was the first time I felt like I could actually program something useful so I immediately put a hold on the udemy course and spent the next month building this calculator.

##### Technologies

- HTML
- CSS
- javascript

I hadn't been introduced to React or any UI framework/library at this point, and hadn't a clue about how to write well structured code that's modularized with a sensible file structure, but I was determined to create this calculator. So all of the javascript is in one file, all of the css is in one file, and there is one index.html file. Yikes!!!!

##### Takeaways

This ended up being great first hand experience of how important writing clean and maintainable code is. The entire script is one large if else statement inside a callback passed to a click event listener on the document object. It is not pleasant to look it. By the end of the project having to fix really any bug was a bit of a nightmare. I'll give my inexperienced self at the time a pat on the back for getting everything to work relatively bug free (...eventually), but I was happy to move on.

I came out the other side of this project feeling pretty comfortable using the DOM api, but with modern UI framworks/libraries like React, Vue, Anguler etc. it would be very hard to make the decision to use vanilla javascript unless it were a very small project. You might gain some performance when you write the code in vanilla javascript, but in most cases I doubt it would be noticable on modern machines. Even then you can use something like Svelte or JQuery for the same performance and a much better development experience.
