'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/client';
import type { User } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddMeasurementForm() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Form state for each measurement field
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState(''); // Hip is often optional

  // Get the current user session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('You must be logged in to add measurements.');
      return;
    }

    // Insert a new record into the user_measurements table
    const { error } = await supabase.from('user_measurements').insert({
      user_id: user.id,
      weight: parseFloat(weight),
      height: parseFloat(height),
      waist: parseFloat(waist),
      neck: parseFloat(neck),
      hip: hip ? parseFloat(hip) : null, // Save as null if empty
    });

    if (error) {
      console.error('Error inserting measurement:', error);
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Measurement saved successfully! ✅');
      // Reset form fields
      setWeight('');
      setHeight('');
      setWaist('');
      setNeck('');
      setHip('');
      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setMessage(''); // Clear message on close
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* The form tag now wraps the content and has the submit handler */}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Measurement</DialogTitle>
            <DialogDescription>
              Enter your latest measurements. Click save when you re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="waist" className="text-right">Waist (cm)</Label>
              <Input
                id="waist"
                name="waist"
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="neck" className="text-right">Neck (cm)</Label>
              <Input
                id="neck"
                name="neck"
                type="number"
                step="0.1"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hip" className="text-right">Hip (cm)</Label>
              <Input
                id="hip"
                name="hip"
                type="number"
                step="0.1"
                placeholder="Optional"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Display feedback message */}
          {message && <p className="text-center text-sm mb-4">{message}</p>}

          <DialogFooter>
            <Button type="submit">Save Measurement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}