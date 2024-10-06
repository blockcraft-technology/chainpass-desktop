import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react"
//@ts-ignore
import confetti from 'canvas-confetti'
import { useNavigate } from "react-router-dom"

const slides = [
  {
    title: "Secure Password Management",
    description: "Keep all your passwords safe and easily accessible with ChainPass.",
    image: "https://imgur.com/jlS8vcq.png",
  },
  {
    title: "Blockchain-Powered Security",
    description: "Leverage the power of blockchain for unparalleled data protection.",
    image: "https://imgur.com/TZ8LoDK.png",
  },
  {
    title: "Advanced Encryption",
    description: "Your data is encrypted with state-of-the-art algorithms for maximum security.",
    image: "https://imgur.com/HrJQGaQ.png",
  },
]

const ParticleAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
      })
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

export default function Intro() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const introFlag = localStorage.getItem('hasSeenIntro')
    setHasSeenIntro(!!introFlag)
  }, [])

  const handleContinue = () => {
    localStorage.setItem('hasSeenIntro', 'true')
    navigate('/onboarding')
  }


  const handleNext = () => {
    setDirection(1)
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    setDirection(-1)
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleFinish = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    setTimeout(() => {
      handleContinue()
    }, 1000)
  }

  const isLastSlide = currentSlide === slides.length - 1

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext()
      } else if (event.key === "ArrowLeft") {
        handlePrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlide])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }


  if (hasSeenIntro) {
    navigate('/onboarding')
    return null
  }
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black text-white">
      <ParticleAnimation />
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent pointer-events-none" />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/30 via-transparent to-transparent blur-2xl" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 relative z-10">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto relative z-10">
              {slides[currentSlide].description}
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/50 via-transparent to-transparent blur-xl" />
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-contain filter drop-shadow-2xl relative z-10 rounded-3xl"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center space-x-4"
          >
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="bg-white/10 hover:bg-white/20 text-white border-white text-sm"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            <Button
              onClick={isLastSlide ? handleContinue : handleNext}
              className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 text-sm"
            >
              {isLastSlide ? "Get Started" : "Next"}
              {isLastSlide ? <ArrowRight className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full bg-white ${
              index === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            initial={false}
            animate={{
              scale: index === currentSlide ? 1.5 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        ))}
      </div>
    </div>
  )
}