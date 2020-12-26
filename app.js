const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide')),
  initialWindowWidth = window.innerWidth

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
  console.log('current index', currentIndex)
  startPos = event.touches[0].clientX
  isDragging = true
  animationID = requestAnimationFrame(animation)
}

// TODO
// when touch end, center the indexed image if moved enough
// or go back to previous image if not moved far enough

function touchEnd(event) {
  cancelAnimationFrame(animationID)
  isDragging = false
  const movedBy = currentTranslate - prevTranslate
  console.log(movedBy)
  // this leaves it where it is scrolled to
  prevTranslate = currentTranslate
  // if not moved enough then snap back to current index
  if (Math.abs(movedBy) < 100) {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
  }
  // if moved enough negative snap to next slide
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    console.log('moving to next slide')
    currentIndex += 1
  }
  // if movedby enough positive snap to previous slide if there is one
  if (movedBy > 100 && currentIndex > 0) {
    console.log('moving to prev slide')
    currentIndex -= 1
  }
  currentTranslate = currentIndex * -window.innerWidth
  prevTranslate = currentTranslate

  // if moved enough positive snap to prev slide
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
