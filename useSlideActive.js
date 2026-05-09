import { useEffect, useRef, useState } from 'react'

/**
 * Returns [ref, active]. Attach the ref to any element inside a slide;
 * `active` flips to true while the enclosing <section data-deck-slide>
 * has data-deck-active (i.e. the deck is showing it), and back to false
 * when the user navigates away.
 *
 * Pair with Framer Motion variants to replay entry animations every
 * time the user navigates back to the slide:
 *
 *   const [ref, active] = useSlideActive()
 *   <motion.div
 *     ref={ref}
 *     initial="hidden"
 *     animate={active ? 'show' : 'hidden'}
 *     variants={FADE_UP}
 *   />
 */
export function useSlideActive() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const section = node.closest('[data-deck-slide]')
    if (!section) return

    const sync = () => setActive(section.hasAttribute('data-deck-active'))
    sync()

    const observer = new MutationObserver(sync)
    observer.observe(section, {
      attributes: true,
      attributeFilter: ['data-deck-active'],
    })
    return () => observer.disconnect()
  }, [])

  return [ref, active]
}
