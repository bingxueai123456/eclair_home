import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './Login.css'

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // 模拟加载效果
    setTimeout(() => {
      // 固定账号密码校验
      if (username === 'eclair' && password === 'eclair@123') {
        // 登录成功，保存登录状态（1个月）
        const expireTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30天
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('loginExpireTime', expireTime.toString())
        localStorage.setItem('username', username)
        onLoginSuccess()
      } else {
        setError('账号或密码错误')
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-circle">
              <FontAwesomeIcon icon={faLock} />
            </div>
          </div>
          <h1>Eclair Collection</h1>
          <p>登录以继续访问</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">账号</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入账号"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>LIVE</p>
        </div>
      </div>
    </div>
  )
}

export default Login

