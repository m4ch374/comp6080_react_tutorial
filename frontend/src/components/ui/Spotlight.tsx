import { motion } from 'motion/react'
import React from 'react'

type SpotlightProps = {
  className?: string
  fill?: string
}

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <motion.div
      className={`pointer-events-none absolute z-0 h-full w-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1 }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2000 1000"
      >
        <defs>
          <radialGradient
            id="spotlight-gradient"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor={fill || '#818cf8'}
              stopOpacity="0.4"
            />
            <stop
              offset="100%"
              stopColor={fill || '#818cf8'}
              stopOpacity="0"
            />
          </radialGradient>
        </defs>
        <ellipse
          cx="50%"
          cy="50%"
          rx="40%"
          ry="40%"
          fill="url(#spotlight-gradient)"
        />
      </svg>
    </motion.div>
  )
}

