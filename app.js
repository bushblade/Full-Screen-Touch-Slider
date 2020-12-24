const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide')),
  initialWindowWidth = window.innerWidth

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
  slide.addEventListener('touchstart', (e) => {
    currentIndex = index
    dragStart(e)
  })
  // slide.addEventListener('mousedown', dragStart)
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)
})

function dragStart(event) {
  console.log('drag start')
  startPos = event.touches[0].clientX
  isDragging = true
  animationID = requestAnimationFrame(animation)
}

function touchEnd(event) {
  isDragging = false
  prevTranslate = currentTranslate
  cancelAnimationFrame(animationID)
  // console.log(event.type)
  // console.log('finished dragging')
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = event.touches[0].clientX
    currentTranslate = prevTranslate + currentPosition - startPos
    // slider.style.transform = `currentTranslate(${currentTranslate + diff}px)`
  }
}

function animation(timeStamp) {
  slider.style.transform = `translateX(${currentTranslate}px)`
  if (isDragging) {
    requestAnimationFrame(animation)
  }
}
