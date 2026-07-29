import { useState } from 'react'
import { apiRequest } from '../../services/api'

export default function LoginScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState('login')
  const [formName, setFormName] = useState('') 
  const [email, setEmail] = useState('admin@gamewolf.test')
  const [password, setPassword] = useState('GameWolf#2026')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  function validateEmail(val) {
    if (!val) return 'El correo es obligatorio.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Ingresa un correo válido.'
    return ''
  }

  function validatePassword(val) {
    if (!val) return 'La contraseña es obligatoria.'
    if (val.length < 8) return 'Mínimo 8 caracteres.'
    if (!/[A-Z]/.test(val)) return 'Falta al menos una mayúscula.'
    if (!/[0-9]/.test(val)) return 'Falta al menos un número.'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return 'Falta un carácter especial.'
    return ''
  }

  function validateResetToken(val) {
    if (!val) return 'El token de recuperación es obligatorio.'
    return ''
  }

  function changeMode(mode) {
    setAuthMode(mode)
    setErrors({})
    setApiError('')
    setNotice('')
  }

  function handleEmailChange(e) {
    const val = e.target.value
    setEmail(val)
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }))
  }

  function handlePasswordChange(e) {
    const val = e.target.value
    setPassword(val)
    setErrors((prev) => ({ ...prev, password: validatePassword(val) }))
  }

  function handlePasswordConfirmationChange(e) {
    const val = e.target.value
    setPasswordConfirmation(val)
    setErrors((prev) => ({
      ...prev,
      password_confirmation: val !== password ? 'La confirmación no coincide.' : '',
    }))
  }

  function handleResetTokenChange(e) {
    const val = e.target.value
    setResetToken(val)
    setErrors((prev) => ({ ...prev, token: validateResetToken(val) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')
    setNotice('')

    const emailErr = validateEmail(email)

    if (authMode === 'register') {
      const nameErr = !formName.trim() ? 'El nombre es obligatorio.' : ''
      const passErr = validatePassword(password)
      const confirmationErr = passwordConfirmation !== password ? 'La confirmación no coincide.' : ''
      
      setErrors({ email: emailErr, password: passErr, password_confirmation: confirmationErr, nombre: nameErr })
      if (emailErr || passErr || confirmationErr || nameErr) return

      setLoading(true)
      try {
        await apiRequest('/autenticacion/registro', {
          method: 'POST',
          body: { 
            nombre: formName, 
            email, 
            password, 
            password_confirmation: passwordConfirmation, 
            rol: 'cliente' 
          },
        })
        setNotice('Cuenta creada con éxito. Ahora puedes iniciar sesión.')
        setAuthMode('login')
        setPassword('')
        setPasswordConfirmation('')
      } catch (err) {
        setApiError(err.message || 'No se pudo crear la cuenta.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (authMode === 'recover') {
      setErrors({ email: emailErr })
      if (emailErr) return

      setLoading(true)
      try {
        const data = await apiRequest('/autenticacion/recuperar-contrasena', {
          method: 'POST',
          body: { email },
        })
        setNotice(`${data.mensaje} Si el correo esta en modo log, revisa backend/storage/logs/laravel.log.`)
        setAuthMode('reset')
      } catch (err) {
        setApiError(err.message || 'No se pudo enviar el token de recuperación.')
      } finally {
        setLoading(false)
      }

      return
    }

    if (authMode === 'reset') {
      const tokenErr = validateResetToken(resetToken)
      const passErr = validatePassword(password)
      const confirmationErr = passwordConfirmation !== password ? 'La confirmación no coincide.' : ''
      setErrors({
        email: emailErr,
        token: tokenErr,
        password: passErr,
        password_confirmation: confirmationErr,
      })

      if (emailErr || tokenErr || passErr || confirmationErr) return

      setLoading(true)
      try {
        const data = await apiRequest('/autenticacion/restablecer-contrasena', {
          method: 'POST',
          body: {
            email,
            token: resetToken,
            password,
            password_confirmation: passwordConfirmation,
          },
        })
        setNotice(data.mensaje)
        setPassword('')
        setPasswordConfirmation('')
        setResetToken('')
        setAuthMode('login')
      } catch (err) {
        setApiError(err.message || 'No se pudo restablecer la contraseña.')
      } finally {
        setLoading(false)
      }

      return
    }

    const passErr = validatePassword(password)
    setErrors({ email: emailErr, password: passErr })

    if (emailErr || passErr) return

    setLoading(true)
    try {
      const data = await apiRequest('/autenticacion/iniciar-sesion', {
        method: 'POST',
        body: { email, password },
      })
      onLogin(data)
    } catch (err) {
      setApiError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-art" aria-label="GameWolf">
        <img src="/img/fondo-login.png" alt="" />
        <div className="login-art-overlay">
          <span>GameWolf Store</span>
          <strong>Gestiona, vende y controla tus videojuegos</strong>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <img className="login-logo" src="/img/logo-gamewolf.png" alt="GameWolf" />
          <h1>GameWolf</h1>
          <p className="muted">
            {authMode === 'login' && 'Ingresa tus datos para acceder al sistema'}
            {authMode === 'register' && 'Crea una cuenta para comprar videojuegos'}
            {authMode === 'recover' && 'Solicita un token para recuperar tu contraseña'}
            {authMode === 'reset' && 'Escribe el token recibido y tu nueva contraseña'}
          </p>

          {authMode === 'login' && (
            <div className="demo-users" aria-label="Usuarios de prueba">
              <button type="button" onClick={() => { setEmail('admin@gamewolf.test'); setPassword('GameWolf#2026'); setErrors({}) }}>Admin</button>
              <button type="button" onClick={() => { setEmail('empleado@gamewolf.test'); setPassword('GameWolf#2026'); setErrors({}) }}>Empleado</button>
              <button type="button" onClick={() => { setEmail('cliente@gamewolf.test'); setPassword('GameWolf#2026'); setErrors({}) }}>Cliente</button>
            </div>
          )}

          {authMode === 'register' && (
            <label className="field">
              <span>Nombre completo</span>
              <input value={formName} type="text" onChange={(e) => {
                setFormName(e.target.value)
                setErrors((prev) => ({ ...prev, nombre: !e.target.value ? 'El nombre es obligatorio.' : '' }))
              }} />
              {errors.nombre && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.nombre}</small>}
            </label>
          )}

          <label className="field">
            <span>Correo electrónico</span>
            <input value={email} type="email" onChange={handleEmailChange} />
            {errors.email ? (
              <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.email}</small>
            ) : (
              <small>Usa uno de los usuarios demo o escribe un correo registrado.</small>
            )}
          </label>

          {authMode === 'reset' && (
            <label className="field">
              <span>Token de recuperación</span>
              <input value={resetToken} type="text" onChange={handleResetTokenChange} />
              {errors.token ? (
                <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.token}</small>
              ) : (
                <small>Pega el token enviado al correo electrónico.</small>
              )}
            </label>
          )}

          {authMode !== 'recover' && (
            <label className="field">
              <span>{authMode === 'reset' ? 'Nueva contraseña' : 'Contraseña'}</span>
              <input value={password} type="password" onChange={handlePasswordChange} />
              {errors.password ? (
                <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.password}</small>
              ) : (
                <small>Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.</small>
              )}
            </label>
          )}

          {(authMode === 'reset' || authMode === 'register') && (
            <label className="field">
              <span>Confirmar contraseña</span>
              <input value={passwordConfirmation} type="password" onChange={handlePasswordConfirmationChange} />
              {errors.password_confirmation ? (
                <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.password_confirmation}</small>
              ) : (
                <small>Debe coincidir con la {authMode === 'reset' ? 'nueva ' : ''}contraseña.</small>
              )}
            </label>
          )}

          {apiError && <p className="form-error">{apiError}</p>}
          {notice && <p className="form-success" style={{ color: '#16a34a' }}>{notice}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {authMode === 'login' && (loading ? 'Entrando...' : 'Entrar')}
            {authMode === 'register' && (loading ? 'Creando...' : 'Crear cuenta')}
            {authMode === 'recover' && (loading ? 'Enviando...' : 'Enviar token')}
            {authMode === 'reset' && (loading ? 'Guardando...' : 'Restablecer contraseña')}
          </button>

          {authMode === 'login' && (
            <>
              <button className="link-button" type="button" onClick={() => changeMode('recover')}>
                Olvidaste tu contraseña
              </button>
              <button className="link-button" type="button" onClick={() => changeMode('register')} style={{ marginTop: '10px' }}>
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </>
          )}

          {authMode === 'recover' && (
            <button className="link-button" type="button" onClick={() => changeMode('reset')}>
              Ya tengo un token
            </button>
          )}

          {authMode !== 'login' && (
            <button className="link-button" type="button" onClick={() => changeMode('login')}>
              Volver a iniciar sesión
            </button>
          )}
        </form>
      </section>
    </main>
  )
}
