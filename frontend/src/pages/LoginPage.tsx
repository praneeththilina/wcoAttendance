import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth';
import { loginSchema, type LoginFormData } from '@/validators/auth.validator';
import { ROUTES } from '@/constants';
import { Button, Input, Checkbox } from '@/components/ui';
import type { UserRole } from '@/types';

export function LoginPage() {
  const navigate = useNavigate();
  const { setTokens, setUser, setLoading, setError, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    setLoading(true);

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (response.success) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);

        // Redirect based on role
        const roleRedirects: Record<UserRole, string> = {
          employee: ROUTES.DASHBOARD,
          admin: ROUTES.ADMIN_DASHBOARD,
          manager: ROUTES.MANAGER_DASHBOARD,
          hr: ROUTES.HR_DASHBOARD,
        };

        navigate(roleRedirects[response.data.user.role] || ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex flex-col h-auto min-h-screen w-full overflow-x-hidden pb-12 group/design-root">
        {/* Top App Bar */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="text-primary dark:text-primary/80 flex size-12 shrink-0 items-center justify-start cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Attendance Tracker
          </h2>
        </div>

        {/* Corporate Hero Image / Logo Container */}
        <div className="px-4 py-3">
          <div
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-primary/10 rounded-lg min-h-[180px] relative"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-IrZQQqhDSMLzIFlmHwTD02QeQfIi00ym-ECojtDyfbaqLvvqKymOo4zMjTmTLnBKDki4W2C4iPNj_DndW3eFfYnfi0e-QIQThgo_-9rK8dA-BcwQDFB3vK7AD1KWpCSIVEUqWre2T2hUgOHhqVxz8y0Wh-XmKuHQuhTpqs78wEZyE4S2p1-cGCXfXZA82jHwsXgq9JvRTH6l1Zdb31Cl9NO9c50fYKB4Gst9tsMtFqUR8wFH3uidlIK_03qxVkPclYtegbrg1F5p")',
            }}
          >
            <div className="absolute inset-0 bg-primary/40"></div>
            <div className="relative z-10 p-6 flex justify-center">
              <div className="bg-white/90 p-4 rounded-lg shadow-lg">
                <span className="material-symbols-outlined text-primary text-5xl">
                  domain_verification
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="px-6 py-8">
          <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-[32px] font-bold leading-tight text-center">
            Welcome back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pt-2 text-center">
            Professional Audit Firm Attendance Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-6">
          {/* Email Field */}
          <Input
            label="Employee ID or Email"
            type="text"
            placeholder="Ex: AUDIT-1234 or email@company.com"
            error={errors.email?.message}
            leftIcon={<span className="material-symbols-outlined">person</span>}
            {...register('email')}
          />

          {/* Password Field */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            leftIcon={<span className="material-symbols-outlined">lock</span>}
            rightIcon={
              <span
                className="material-symbols-outlined cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            }
            {...register('password')}
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between py-1">
            <Checkbox label="Remember me" {...register('rememberMe')} />
            <a href="#" className="text-sm font-semibold text-primary dark:text-primary/80 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {useAuthStore.getState().error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
              {useAuthStore.getState().error}
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="mt-2 w-full"
            isLoading={useAuthStore.getState().isLoading}
            rightIcon={<span className="material-symbols-outlined">login</span>}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Help */}
        <div className="mt-auto p-8 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Need help?{' '}
            <a href="#" className="text-primary dark:text-primary/80 font-semibold underline">
              Contact IT Support
            </a>
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
