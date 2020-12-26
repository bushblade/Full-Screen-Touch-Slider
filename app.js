const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide'))

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  currentIndex = 0

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img')
  // disable default image drag
  slideImage.addEventListener('dragstart', (e) => e.preventDefault())
  // touch events
  slide.addEventListener('touchstart', dragStart(index))
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)
  // mouse events
  slide.addEventListener('mousedown', dragStart(index))
  slide.addEventListener('mouseup', touchEnd)
  slide.addEventListener('mousemove', touchMove)
  slide.addEventListener('mouseleave', touchEnd)
})

window.addEventListener('resize', setPositionByIndex)

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function dragStart(index) {
  return function (event) {
    currentIndex = index
    startPos = getPositionX(event)
    isDragging = true
    animationID = requestAnimationFrame(animation)
    slider.classList.add('grabbing')
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID)
  isDragging = false
  const movedBy = currentTranslate - prevTranslate

  // if moved enough negative snap to next slide
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1
  }

  // if moved enough positive snap to previous slide if there is one
  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1
  }
  setPositionByIndex()

  slider.classList.remove('grabbing')
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event)
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}

function animation() {
  setSliderPosition()
  if (isDragging) {
    requestAnimationFrame(animation)
  }
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth
  prevTranslate = currentTranslate
  setSliderPosition()
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`
}
