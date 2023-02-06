const cols = document.querySelectorAll('.col')

// When you press the 'Space' bar, the color changes.
document.addEventListener('keydown', event => {
  event.preventDefault()
  if (event.code.toLowerCase() === 'space') setRandomColors()
})

// Color lock when you click on the lock icon or title.
document.addEventListener('click', event => {
  const type = event.target.dataset.type

  if (type === 'lock') {
    const node = event.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0]
    node.classList.toggle('fa-unlock')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') copyToClickboard(event.target.textContent)
})

function copyToClickboard (text) { return navigator.clipboard.writeText(text) }

// Generating a 16 bit color code.
function generationRandomColor () {
  const hexCodes = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
  }
  return '#' + color
}

// Random color change of columns.
function setRandomColors (isInitial) {
  const colors = isInitial ? getColorsFromHash() : []
  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock')
    const titleColor = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(titleColor.textContent)
      return
    }

    // Alternative - chroma.random() (only if the 'Chroma' library is available)
    const colorBackground = isInitial
      ? colors[index]
        ? colors[index]
        : generationRandomColor()
      : generationRandomColor()

    if (!isInitial) colors.push(colorBackground)

    titleColor.textContent = colorBackground
    col.style.background = colorBackground

    setTextColor(titleColor, colorBackground)
    setTextColor(button, colorBackground)
  })

  updateColorsHash(colors)
}

// Changing the color of the text and the lock icon depending on the color of the columns.
function setTextColor (text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? '#2F4F4F' : '#DCDCDC'
}

// Saving a hash of colors.
function updateColorsHash (colors = []) {
  document.location.hash = colors.map((col) => col.toString().substring(1)).join('-')
}

// Getting colors from a hash.
function getColorsFromHash () {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map(color => '#' + color)
  } else return []
}

setRandomColors(true)
