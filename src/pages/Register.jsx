import { useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import OAuthButtons from '@/components/auth/OAuthButtons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function createRegisterSchema(t) {
  return z
    .object({
      email: z.string().email(t('auth.invalidEmail')),
      username: z.string().min(3, t('auth.shortUsername')),
      password: z.string().min(6, t('auth.shortPassword')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordMismatch'),
      path: ['confirmPassword'],
    })
}

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser, user } = useAuth()
  const { t, isRtl } = useLocale()
  const registerSchema = useMemo(() => createRegisterSchema(t), [t])
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    document.title = t('auth.registerTitle')
  }, [t])

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  async function onSubmit({ email, username, password }) {
    try {
      await registerUser(email, username, password)
      navigate('/')
    } catch (err) {
      setError('root', { message: err.message })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">{t('app.name')}</h1>
          <p className="text-sm text-muted-foreground text-center">
            {t('auth.createAccountSubtitle')}
          </p>
        </CardHeader>
        <CardContent>
          {errors.root && (
            <p className="text-sm text-destructive mb-4">{errors.root.message}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder={t('auth.email')}
                {...register('email')}
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder={t('auth.username')}
                {...register('username')}
                className="w-full"
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder={t('auth.password')}
                {...register('password')}
                className="w-full"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder={t('auth.confirmPassword')}
                {...register('confirmPassword')}
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A] cursor-pointer"
            >
              {isSubmitting && (
                <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${isRtl ? 'ml-2' : 'mr-2'}`} />
              )}
              {isSubmitting ? t('auth.creatingAccount') : t('auth.register')}
            </Button>
          </form>
          <div className="mt-4">
            <OAuthButtons
              mode="signUp"
              onError={(message) => setError('root', { message })}
            />
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t('auth.login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
