import { SpringSystem } from "rebound"

const getViewportCoords = () => {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
  }
}

const getScrollHeight = () => {
  // insane code courtesy of https://javascript.info/size-and-scroll-window
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  )
}

const rectInViewport = (
  { top, bottom, left, right },
  { width: windowWidth, height: windowHeight }
) => {
  return top < windowHeight && bottom > 0 && left < windowWidth && right > 0
}

const rectCloseToViewport = ({ top, bottom }, { height: windowHeight }) => {
  return top < windowHeight * 3 && bottom > -windowHeight * 2
}

const initScrollBounce = ({ effectMultiplier = 2 } = {}) => {
  const springSystem = new SpringSystem()

  const children = [...document.querySelectorAll("[data-bounce-id]")]

  let offset = window.pageYOffset

  const springs = children
    .map(child => {
      const spring = springSystem.createSpring()

      spring.addListener({
        onSpringUpdate(_spring) {
          const val = _spring.getCurrentValue()
          child.style.transform = `translateY(${val}px)`
        }
      })
      return [child, spring]
    })
    .reduce((acc, curr) => {
      acc[curr[0].dataset.bounceId] = curr[1]
      return acc
    }, {})

  const resetSprings = () => {
    Object.keys(springs).forEach(s => {
      springs[s].setEndValue(0)
    })
  }

  let cache = {}

  const getCenter = bounding => {
    return bounding.top + bounding.height / 2
  }

  const onScroll = () => {
    if (!cache.scrollHeight) cache.scrollHeight = getScrollHeight()

    const fastScroll = Math.abs(diff) > cache.viewportCoords.height
    if (fastScroll) return

    const newOffset = window.pageYOffset

    if (newOffset <= 0) return

    if (newOffset >= cache.scrollHeight - cache.viewportCoords.height) {
      return
    }
    const diff = offset - newOffset

    const closestChild = document.querySelector([
      `[data-bounce-id="${cache.closestBounceId}"]`
    ])

    const closestChildIndex = children.indexOf(closestChild)

    const animatedChildrenDict = {}

    let animatedAboveIndex = closestChildIndex - 1
    let animatedBelowIndex = closestChildIndex + 1

    const scrollDown = diff > 0

    if (scrollDown) {
      while (true) {
        const el = children[animatedAboveIndex]
        if (!el) break
        const bounding = el.getBoundingClientRect()
        const isAnimated = rectCloseToViewport(bounding, cache.viewportCoords)
        if (!isAnimated) break
        animatedChildrenDict[el.dataset.bounceId] = bounding
        animatedAboveIndex -= 1
      }
    } else {
      while (true) {
        const el = children[animatedBelowIndex]
        if (!el) break
        const bounding = el.getBoundingClientRect()
        const isAnimated = rectCloseToViewport(bounding, cache.viewportCoords)
        if (!isAnimated) break
        animatedChildrenDict[el.dataset.bounceId] = bounding
        animatedBelowIndex += 1
      }
    }

    const animatedChildren = children
      .filter(c => {
        return animatedChildrenDict[c.dataset.bounceId]
      })
      .map(c => {
        return [c, animatedChildrenDict[c.dataset.bounceId]]
      })

    children
      .filter(c => {
        return !animatedChildrenDict[c.dataset.bounceId]
      })
      .forEach(c => {
        c.style.willChange = ""
        springs[c.dataset.bounceId].setEndValue(0)
      })

    animatedChildren.forEach(([child, bounding]) => {
      child.style.willChange = "transform"

      const spring = springs[child.dataset.bounceId]

      let resistance =
        Math.abs(cache.clientY - getCenter(bounding)) /
        cache.viewportCoords.height

      resistance = resistance * effectMultiplier

      spring.setEndValue(-diff * resistance)
    })

    offset = newOffset
  }

  let scrollListener = false

  const onTouchStart = event => {
    if (!scrollListener)
      scrollListener = window.addEventListener("scroll", onScroll)
    cache.clientY = event.targetTouches[0].clientY

    cache.viewportCoords = getViewportCoords()

    const closestElTuple = children.reduce((acc, curr, i, source) => {
      if (acc.length && acc[0] !== source[i - 1]) return acc
      const bounding = curr.getBoundingClientRect()
      if (!rectInViewport(bounding, cache.viewportCoords)) return acc
      if (
        acc.length === 0 ||
        Math.abs(cache.clientY - getCenter(bounding)) <
          Math.abs(cache.clientY - getCenter(acc[1]))
      ) {
        return [curr, bounding]
      }
      return acc
    }, [])

    cache.closestBounceId = closestElTuple[0].dataset.bounceId
  }

  const onTouchEnd = () => {
    window.removeEventListener("scroll", onScroll)
    resetSprings()
    cache = {}
  }

  const onTouchMove = event => {
    cache.clientY = event.targetTouches[0].clientY
  }

  window.addEventListener("touchstart", onTouchStart, false)
  window.addEventListener("touchmove", onTouchMove, false)
  window.addEventListener("touchend", onTouchEnd, false)

  return () => {
    window.removeEventListener("touchstart", onTouchStart, false)
    window.removeEventListener("touchmove", onTouchMove, false)
    window.removeEventListener("touchend", onTouchEnd, false)
  }
}

export default initScrollBounce
