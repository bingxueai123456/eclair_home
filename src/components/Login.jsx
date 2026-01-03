import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import './Login.css'

// 星星粒子类
class Star {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = Math.random() * 2 + 0.5
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.opacity = Math.random() * 0.8 + 0.2
    this.twinkleSpeed = Math.random() * 0.02 + 0.01
    this.twinklePhase = Math.random() * Math.PI * 2
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.twinklePhase += this.twinkleSpeed

    if (this.x < 0 || this.x > this.canvas.width || 
        this.y < 0 || this.y > this.canvas.height) {
      this.reset()
    }
  }

  draw(ctx) {
    const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * twinkle})`
    ctx.fill()
  }
}

// 流星类
class Meteor {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width * 1.5
    this.y = -10
    this.length = Math.random() * 80 + 40
    this.speed = Math.random() * 15 + 10
    this.opacity = Math.random() * 0.6 + 0.4
    this.active = Math.random() > 0.97
  }

  update() {
    if (!this.active) {
      this.active = Math.random() > 0.995
      return
    }
    
    this.x -= this.speed
    this.y += this.speed * 0.6

    if (this.y > this.canvas.height || this.x < -this.length) {
      this.reset()
      this.active = false
    }
  }

  draw(ctx) {
    if (!this.active) return
    
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x + this.length * 0.7, this.y - this.length * 0.4
    )
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + this.length * 0.7, this.y - this.length * 0.4)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

// 星系背景组件
function GalaxyBackground() {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const meteorsRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resize()
    window.addEventListener('resize', resize)

    starsRef.current = Array(200).fill(null).map(() => new Star(canvas))
    meteorsRef.current = Array(5).fill(null).map(() => new Meteor(canvas))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      starsRef.current.forEach(star => {
        star.update()
        star.draw(ctx)
      })
      
      meteorsRef.current.forEach(meteor => {
        meteor.update()
        meteor.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="galaxy-canvas" />
}

// 登录页面组件（仅登录，无注册）
export default function Login() {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('请填写邮箱和密码')
      return
    }

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message || '登录失败，请检查邮箱和密码')
    }
  }

  return (
    <div className="login-page">
      {/* 星系背景 */}
      <GalaxyBackground />
      
      {/* 渐变叠加层 */}
      <div className="gradient-overlay" />
      
      {/* 星云效果 */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />

      {/* 主内容 */}
      <div className="login-container">
        {/* Logo 和标题 */}
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-glow" />
            <div className="logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M12 2C12 2 14 6 14 12C14 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2C12 2 10 6 10 12C10 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <h1 className="title">Eclair Collection</h1>
          <p className="subtitle">知识星图 · 信息聚合</p>
        </div>

        {/* 登录卡片 */}
        <div className="login-card">
          <div className="card-glow" />
          
          <h2 className="card-title">欢迎回来</h2>
          <p className="card-subtitle">登录以继续探索</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">邮箱</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">密码</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V17M6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V13C20 12.4696 19.7893 11.9609 19.4142 11.5858C19.0391 11.2107 18.5304 11 18 11H6C5.46957 11 4.96086 11.2107 4.58579 11.5858C4.21071 11.9609 4 12.4696 4 13V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21ZM16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M13.875 18.825C13.2583 18.9417 12.6333 19 12 19C7 19 2.73 15.11 1 12C1.69 10.69 2.57 9.51 3.61 8.5M6.53 6.53C8.09 5.56 9.94 5 12 5C17 5 21.27 8.89 23 12C22.15 13.58 20.91 14.97 19.37 16.08M6.53 6.53L3 3M6.53 6.53L9.88 9.88M19.37 16.08L22 19M19.37 16.08L14.12 10.83M9.88 9.88C9.32 10.44 9 11.2 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.8 15 13.56 14.68 14.12 14.12M9.88 9.88L14.12 14.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C2.73 8.89 7 5 12 5C17 5 21.27 8.89 23 12C21.27 15.11 17 19 12 19C7 19 2.73 15.11 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="message error">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>
        </div>

        {/* 底部信息 */}
        <div className="login-footer">
          <p>知识聚合 · 探索无限</p>
        </div>
      </div>
    </div>
  )
}
