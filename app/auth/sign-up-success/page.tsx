'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/client';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { GalleryVerticalEnd } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
// Define a type for our profile data for type safety

export default function UserProfileForm() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // State for form fields
  const [fullName, setFullName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setMessage('');

      // Get the currently authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        // Fetch the user's profile from the user_profiles table
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, gender, date_of_birth')
          .eq('user_id', user.id)
          .single(); // .single() expects one row and returns an object instead of an array

        if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
          console.error('Error fetching profile:', error.message);
          setMessage(`Error: ${error.message}`);
        }

        if (data) {
          // Pre-fill form with existing data
          setFullName(data.full_name || '');
          setGender(data.gender || '');
          setDateOfBirth(data.date_of_birth || '');
        }
      } else {
        // Handle case where user is not logged in
        setMessage('Please log in to view or update your profile.');
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('You must be logged in to update your profile.');
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        full_name: fullName,
        date_of_birth: dateOfBirth,
        gender: gender,
      });

    if (error) {
      console.error('Error updating profile:', error.message);
      setMessage(`Error updating profile: ${error.message}`);
    } else {
      router.push('/');
      setMessage('Profile updated successfully! ✅');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (

    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Fitwo Prod.
        </a>
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Hello 👋</CardTitle>
              <CardDescription>This is a robbery 🔫. Give me your data</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="full_name">Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className='grid gap-3'>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={gender}
                        onValueChange={(value) => setGender(value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
      {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}