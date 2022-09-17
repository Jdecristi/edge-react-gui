import * as React from 'react'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

// Animate the opacity based on the visibility toggle:
export const useFadeAnimation = (visible: boolean, options: { noFadeIn?: boolean; duration?: number }) => {
  const { noFadeIn = false, duration = 500 } = options

  const firstRender = React.useRef<boolean>(true)
  const opacity = useSharedValue(noFadeIn ? 1 : 0)
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    opacity.value = withTiming(visible ? 1 : 0, { duration })
  }, [duration, opacity, visible])

  return style
}
