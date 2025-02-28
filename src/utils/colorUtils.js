export const generateColorPalette = (count) => {
    const baseHue = Math.floor(Math.random() * 360)
    return Array.from({ length: count }, (_, i) => 
      `hsl(${(baseHue + (i * (360 / count))) % 360}, 70%, 50%)`
    )
  }