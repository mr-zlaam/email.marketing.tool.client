import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { createUserSchema, type CreateUserFormData } from '@/schemas/validation.schemas';

export const CreateUser = () => {
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema)
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserFormData) => apiClient.createUser(userData),
    onSuccess: (response: unknown) => {
      const apiResponse = response as { success?: boolean; data?: { message?: string }; message?: string };
      const successMessage = apiResponse.data?.message || apiResponse.message || 'User created successfully!';
      setCreateSuccess(successMessage);
      setCreateError(null);
      toast.success(successMessage);
      reset();
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || 'Failed to create user';
      setCreateError(errorMessage);
      setCreateSuccess(null);
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: CreateUserFormData) => {
    setCreateError(null);
    setCreateSuccess(null);
    // Always set role to USER for admin-created accounts
    const userData = { ...data, role: 'USER' as const };
    createUserMutation.mutate(userData);
  };

  return (
    <Layout title="Create User">
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
              <p className="text-gray-600">Add a new user account to the system</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-3">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter unique username"
                  {...register('username')}
                  className={`h-12 text-base ${errors.username ? 'border-red-400 focus-visible:ring-red-400' : 'border-gray-200 focus-visible:ring-amber-600'} transition-colors`}
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-500 font-medium">{errors.username.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Only letters, numbers, and underscores allowed</p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-3">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter user's full name"
                  {...register('fullName')}
                  className={`h-12 text-base ${errors.fullName ? 'border-red-400 focus-visible:ring-red-400' : 'border-gray-200 focus-visible:ring-amber-600'} transition-colors`}
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-500 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter user email address"
                  {...register('email')}
                  className={`h-12 text-base ${errors.email ? 'border-red-400 focus-visible:ring-red-400' : 'border-gray-200 focus-visible:ring-amber-600'} transition-colors`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter user password"
                  {...register('password')}
                  className={`h-12 text-base ${errors.password ? 'border-red-400 focus-visible:ring-red-400' : 'border-gray-200 focus-visible:ring-amber-600'} transition-colors`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 font-medium">{errors.password.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              </div>

            </div>

            {createError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium">{createError}</p>
              </div>
            )}

            {createSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">{createSuccess}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {createUserMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={createUserMutation.isPending}
                className="px-6 h-12 text-base font-semibold"
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </Layout>
  );
};