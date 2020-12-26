const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide'))

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  currentIndex = 0

// TODO
// add event listeners for mousedown and move

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img')
  // disable default image drag
  slideImage.addEventListener('dragstart', (e) => e.preventDefault())
  slide.addEventListener('touchstart', (e) => {
    currentIndex = index
    dragStart(e)
  })
  // slide.addEventListener('mousedown', dragStart)
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)
})

function dragStart(event) {
  startPos = event.touches[0].clientX
  isDragging = true
  animationID = requestAnimationFrame(animation)
}

function touchEnd(event) {
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
  currentTranslate = currentIndex * -window.innerWidth
  prevTranslate = currentTranslate

  setSliderPosition()
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = event.touches[0].clientX
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}

function animation(timeStamp) {
  setSliderPosition()
  if (isDragging) {
    requestAnimationFrame(animation)
  }
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`
}
