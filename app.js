const spawnSliderOn = function(baseSelector) {
  // get our elements
  const slider = document.querySelector(`${baseSelector} .slider-container`),
    slides = Array.from(document.querySelectorAll(`${baseSelector} .slider-container .slide`))

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

  sliderPrevControl.addEventListener('click', goPrev)
  sliderNextControl.addEventListener('click', goNext)

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
  window.oncontextmenu = function (event) {
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
    event.preventDefault()
    event.stopPropagation()
    cumulativeHorizontalScrollDelta += event.deltaX
    if (allowScrollEventPropagation === false) {
      cumulativeHorizontalScrollDelta = 0
    } else if (Math.abs(cumulativeHorizontalScrollDelta) >= 100) {
      allowScrollEventPropagation = false
      if (cumulativeHorizontalScrollDelta >= 100) {
        if (currentIndex < slides.length - 1) {
          currentIndex += 1
          setPositionByIndex()
        }
      } else if (cumulativeHorizontalScrollDelta <= -100) {
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
    return false
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

    setPositionByIndex()

    slider.classList.remove('grabbing')
  }

  function animation() {
    setSliderPosition()
    if (isDragging) requestAnimationFrame(animation)
  }

  function setPositionByIndex() {
    if (currentIndex == 0) {
      sliderPrevControl.disabled = true;
    } else {
      sliderPrevControl.disabled = false;
    }
    if (currentIndex == slides.length - 1) {
      sliderNextControl.disabled = true;
    } else {
      sliderNextControl.disabled = false;
    }
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
    setSliderPosition()
  }

  function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`
  }
}
