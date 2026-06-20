import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'

const providerMarks = {
  google: 'G',
  github: 'GH',
}

export default function OAuthButtons({ mode = 'signIn', onError }) {
  const {
    oauthProviders,
    loginWithOAuth,
    registerWithOAuth,
    clerkEnabled,
    loading,
  } = useAuth()
  const { t } = useLocale()

  async function handleOAuth(strategy) {
    if (!clerkEnabled) {
      onError?.(t('auth.oauthRequiresClerk'))
      return
    }

    try {
      const startOAuth = mode === 'signUp' ? registerWithOAuth : loginWithOAuth
      await startOAuth(strategy)
    } catch (err) {
      onError?.(err.message || t('auth.oauthFailed'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>{t('auth.orContinue')}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {oauthProviders.map((provider) => {
          const mark = providerMarks[provider.id]
          const label = t(`social.${provider.id}`)

          return (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOAuth(provider.strategy)}
              className="h-10 w-full cursor-pointer"
              aria-label={t('auth.continueWith', { provider: label })}
            >
              {mark && (
                <span className="flex size-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                  {mark}
                </span>
              )}
              {label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
