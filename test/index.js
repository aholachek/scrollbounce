import initBounce from "../src/index"

const ul = document.querySelector("ul")

;[...new Array(200).keys()].forEach(i => {
  const li = document.createElement("li")
  li.dataset.bounceId = `bounce-id-${i}`
  ul.appendChild(li)
})

initBounce({ effectMultiplier: 3 })
