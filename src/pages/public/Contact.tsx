import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlatformStore } from '@/stores/platformStore';
import { addDocToCollection } from '@/lib/firebase/db';
import { toast } from 'sonner';

const SUBJECTS = [
  'General Inquiry',
  'Membership',
  'Press',
  'Collaboration',
  'Order Support',
];

const inputClassName =
  'border-0 border-b border-nahkya-border rounded-none bg-transparent px-0 text-nahkya-text placeholder:text-nahkya-muted focus-visible:ring-0 focus-visible:border-nahkya-highlight';

export default function Contact() {
  const { platformName, contactEmail, address } = usePlatformStore();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setLoading(true);
    try {
      await addDocToCollection('contactSubmissions', {
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        read: false,
      });
      setSubmitted(true);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-nahkya-bg min-h-screen pb-32 pt-40">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        <p className="font-mono text-mono-md font-medium uppercase text-nahkya-highlight mb-4">
          Get in Touch
        </p>
        <h1 className="font-display text-display-md lg:text-display-lg text-nahkya-text font-medium mb-6">
          Begin a conversation
        </h1>
        <p className="text-body-lg text-nahkya-text-secondary font-body max-w-content mb-16">
          Whether you seek membership, collaboration, press inquiries, or simply wish to learn more about the atelier — we are here.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
        {/* Info */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <p className="font-mono text-mono-md font-medium uppercase text-nahkya-text-secondary mb-3">
              Studio
            </p>
            <p className="text-body-md text-nahkya-text font-body">
              {platformName}
              {address.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className="font-mono text-mono-md font-medium uppercase text-nahkya-text-secondary mb-3">
              Email
            </p>
            <p className="text-body-md text-nahkya-highlight font-body cursor-pointer hover:text-nahkya-border transition-colors">
              {contactEmail}
            </p>
          </div>
          <div>
            <p className="font-mono text-mono-md font-medium uppercase text-nahkya-text-secondary mb-3">
              Studio Hours
            </p>
            <p className="text-body-md text-nahkya-text font-body">
              Monday — Friday
              <br />
              9:00 AM — 5:00 PM
              <br />
              (Brunei Time, GMT+8)
            </p>
          </div>
          <div>
            <p className="font-mono text-mono-md font-medium uppercase text-nahkya-text-secondary mb-3">
              Follow
            </p>
            <div className="flex gap-4">
              <span className="text-body-md text-nahkya-text font-body hover:text-nahkya-highlight transition-colors cursor-pointer">
                Instagram
              </span>
              <span className="text-body-md text-nahkya-text font-body hover:text-nahkya-highlight transition-colors cursor-pointer">
                Pinterest
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-nahkya-success mx-auto mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-heading-sm text-nahkya-text font-medium mb-4">
                  Message Sent
                </h3>
                <p className="text-body-md text-nahkya-text-secondary font-body">
                  We will respond within 48 hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">
                  Your Name
                </Label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <Label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">
                  Email Address
                </Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <Label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">
                  Subject
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">
                  Message
                </Label>
                <Textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className={inputClassName}
                />
              </div>
              <LuxuryButton type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </LuxuryButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
