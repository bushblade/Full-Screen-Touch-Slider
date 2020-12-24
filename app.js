const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide')),
  initialWindowWidth = window.innerWidth

let isDragging = false,
  dragDirection = null,
  startPos = null,
  translateX = 0

slides.forEach((slide) => {
  const slideImage = slide.querySelector('img')
  // disable default image drag
  slideImage.addEventListener('dragstart', (e) => e.preventDefault())
  slide.addEventListener('touchstart', dragStart)
  // slide.addEventListener('mousedown', dragStart)
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)
})

function dragStart(event) {
  console.log('dragging', event)
  startPos = event.touches[0].clientX
  console.log(startPos)
}

function touchEnd(event) {
  console.log(event.type)
  console.log('finished dragging')
}

function touchMove(event) {
  const clientX = event.touches[0].clientX
  // console.log(event.touches[0].screenX)
  dragDirection = clientX > startPos ? 'right' : 'left'

  // calculate how much to translate by

  // dragDirection === 'left'
  //   ? (translateX = startPos + clientX)
  //   : (translateX = startPos - clientX)
  translateX = clientX - startPos

  console.clear()
  console.log('translateX', translateX)

  // slider.style.transform = `translateX(${translateX}px)`

  console.log('dragging', dragDirection)
  console.log('start position', startPos)
}
