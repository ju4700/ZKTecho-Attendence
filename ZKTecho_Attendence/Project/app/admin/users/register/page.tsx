'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserFormData {
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  monthlySalary: number;
  monthlyOffDays: number;
  enrollBiometric: boolean;
}

export default function UserRegistrationPage() {
  const [formData, setFormData] = useState<UserFormData>({
    uniqueId: '',
    name: '',
    email: '',
    phone: '',
    monthlySalary: 0,
    monthlyOffDays: 4,
    enrollBiometric: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast({
          title: "User registered successfully",
          description: `${formData.name} has been added to the system.`,
        });
        
        // Reset form
        setFormData({
          uniqueId: '',
          name: '',
          email: '',
          phone: '',
          monthlySalary: 0,
          monthlyOffDays: 4,
          enrollBiometric: true
        });
      } else {
        setError(data.error || 'Registration failed');
        toast({
          title: "Registration failed",
          description: data.error || 'Please try again.',
          variant: "destructive"
        });
      }
    } catch (error) {
      setError('Network error. Please try again.');
      toast({
        title: "Network error",
        description: 'Please check your connection and try again.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Registration</h1>
          <p className="text-gray-600 mt-1">
            Add a new user to the attendance system
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          View All Users
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              New User Registration
            </CardTitle>
            <CardDescription>
              Fill in the details below to register a new user in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  User registered successfully! They can now use the biometric device.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uniqueId">Unique ID *</Label>
                  <Input
                    id="uniqueId"
                    name="uniqueId"
                    value={formData.uniqueId}
                    onChange={handleInputChange}
                    placeholder="e.g., EMP001"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">
                    This will be used on the biometric device
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@company.com"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+880 1234567890"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlySalary">Monthly Salary (৳) *</Label>
                  <Input
                    id="monthlySalary"
                    name="monthlySalary"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.monthlySalary}
                    onChange={handleInputChange}
                    placeholder="12000"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">
                    Base monthly salary in Taka
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyOffDays">Monthly Off Days *</Label>
                  <Input
                    id="monthlyOffDays"
                    name="monthlyOffDays"
                    type="number"
                    min="0"
                    max="15"
                    value={formData.monthlyOffDays}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">
                    Number of off days per month (0-15)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enrollBiometric"
                  checked={formData.enrollBiometric}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, enrollBiometric: !!checked }))
                  }
                  disabled={loading}
                />
                <Label htmlFor="enrollBiometric" className="text-sm">
                  Enroll user on biometric device immediately
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register User
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/admin/users')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}