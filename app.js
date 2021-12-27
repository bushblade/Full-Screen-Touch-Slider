const spawnSliderOn = function(baseSelector) {
  // get our elements
  const slider = document.querySelector(`${baseSelector} .slider-container`),
    slides = Array.from(document.querySelectorAll(`${baseSelector} .slider-container .slide`))

  const horizontalSensitivity = 100,
    verticalSensitivity = 10

  // set up our state
  let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID,
    currentIndex = 0,
    cumulativeHorizontalScrollDelta = 0,
    allowScrollEventPropagation = true

  // Add event listeners for clicks
  let sliderPrevControl = document.querySelector(`${baseSelector} .slider-controls .slider-prev-control`)
  let sliderNextControl = document.querySelector(`${baseSelector} .slider-controls .slider-next-control`)

  if (sliderPrevControl !== null) {
    sliderPrevControl.addEventListener('click', goPrev)
  }
  if (sliderNextControl !== null) {
    sliderNextControl.addEventListener('click', goNext)
  }

  // add our event listeners
  slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img')
    // disable default image drag
    slideImage.addEventListener('dragstart', function(event) { event.preventDefault() } )
    // touch events
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd)
    slide.addEventListener('touchmove', touchMove)
    // mouse events
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mousemove', touchMove)
    slide.addEventListener('mouseleave', touchEnd)
    // horizontal mouse wheel / touch pad slide events
    slide.addEventListener('wheel', scrollEnd)
  })

  // make responsive to viewport changes
  window.addEventListener('resize', setPositionByIndex)

  // prevent menu popup on long press
  slider.oncontextmenu = function (event) {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
  }

  function goPrev(event) {
    event.preventDefault()
    event.stopPropagation()
    if (currentIndex > 0) {
      currentIndex -= 1
      setPositionByIndex()
    }
    return false
  }

  function goNext(event) {
    event.preventDefault()
    event.stopPropagation()
    if (currentIndex < slides.length - 1) {
      currentIndex += 1
      setPositionByIndex()
    }
    return false
  }

  // use a HOF so we have index in a closure
  function touchStart(index) {
    return function (event) {
      currentIndex = index
      startPos = getPositionX(event)
      isDragging = true
      animationID = requestAnimationFrame(animation)
      slider.classList.add('grabbing')
    }
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event)
      currentTranslate = prevTranslate + currentPosition - startPos
    }
  }

  function scrollEnd(event) {
    result = true
    console.log(event.deltaY);
    if (Math.abs(event.deltaY) < verticalSensitivity) {
      result = false
      event.preventDefault()
      event.stopPropagation()
    }
    cumulativeHorizontalScrollDelta += event.deltaX
    if (allowScrollEventPropagation === false) {
      cumulativeHorizontalScrollDelta = 0
    } else if (Math.abs(cumulativeHorizontalScrollDelta) >= horizontalSensitivity) {
      allowScrollEventPropagation = false
      if (cumulativeHorizontalScrollDelta >= horizontalSensitivity) {
        if (currentIndex < slides.length - 1) {
          currentIndex += 1
          setPositionByIndex()
        }
      } else if (cumulativeHorizontalScrollDelta <= -horizontalSensitivity) {
        if (currentIndex > 0) {
          currentIndex -= 1
          setPositionByIndex()
        }
      }
      window.setTimeout(function() {
        cumulativeHorizontalScrollDelta = 0
        allowScrollEventPropagation = true
      }, 1000)
    }
    return result
  }

  function touchEnd() {
    cancelAnimationFrame(animationID)
    isDragging = false
    const movedBy = currentTranslate - prevTranslate

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -50 && currentIndex < slides.length - 1) {
      currentIndex += 1
    }

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > 50 && currentIndex > 0) {
      currentIndex -= 1
    }

    setPositionByIndex(false)

    slider.classList.remove('grabbing')
  }

  function animation() {
    setSliderPosition()
    if (isDragging) requestAnimationFrame(animation)
  }

  function setPositionByIndex(doScrollIntoView = true) {
    if (sliderPrevControl !== null) {
      if (currentIndex == 0) {
        sliderPrevControl.disabled = true
      } else {
        sliderPrevControl.disabled = false
      }
    }
    if (sliderNextControl !== null) {
      if (currentIndex == slides.length - 1) {
        sliderNextControl.disabled = true
      } else {
        sliderNextControl.disabled = false
      }
    }
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate

    setSliderPosition()

    if (doScrollIntoView === true) {
      slider.scrollIntoView({behavior: "smooth", block: "end", inline: "center"});
    }
  }

  function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`
  }
}
