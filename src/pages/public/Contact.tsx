import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { usePlatformStore } from '@/stores/platformStore';
import { addDocToCollection } from '@/lib/firebase/db';
import { toast } from 'sonner';

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
    <div className="bg-nahkya-ivory min-h-screen pt-40 pb-32">
      <div className="max-w-container mx-auto">
        <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-gold mb-4">GET IN TOUCH</p>
        <h1 className="font-display text-5xl lg:text-display-xl text-nahkya-text font-medium tracking-tight mb-6">Begin a conversation</h1>
        <p className="text-base lg:text-lg text-nahkya-text-muted font-body leading-relaxed max-w-content mb-16">
          Whether you seek membership, collaboration, press inquiries, or simply wish to learn more about the atelier — we are here.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-16 lg:gap-20">
        {/* Info */}
        <div className="space-y-10">
          <div>
            <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-text-muted mb-3">STUDIO</p>
            <p className="text-body-md text-nahkya-text font-body leading-relaxed">
              {platformName}
              {address.map((line) => (
                <span key={line}><br />{line}</span>
              ))}
            </p>
          </div>
          <div>
            <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-text-muted mb-3">EMAIL</p>
            <p className="text-body-md text-nahkya-gold font-body cursor-pointer hover:text-nahkya-gold-soft transition-colors">{contactEmail}</p>
          </div>
          <div>
            <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-text-muted mb-3">STUDIO HOURS</p>
            <p className="text-body-md text-nahkya-text font-body leading-relaxed">Monday — Friday<br />9:00 AM — 5:00 PM<br />(Brunei Time, GMT+8)</p>
          </div>
          <div>
            <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-text-muted mb-3">FOLLOW</p>
            <div className="flex gap-4">
              <span className="text-body-md text-nahkya-text font-body hover:text-nahkya-gold transition-colors cursor-pointer">Instagram</span>
              <span className="text-body-md text-nahkya-text font-body hover:text-nahkya-gold transition-colors cursor-pointer">Pinterest</span>
            </div>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-nahkya-success mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-display text-heading-sm text-nahkya-text font-medium mb-4">Message Sent</h3>
              <p className="text-base text-nahkya-text-muted font-body">We will respond within 48 hours.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">Your Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-nahkya-gold-soft text-nahkya-text font-body text-base pb-3 focus:outline-none focus:border-nahkya-gold transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-nahkya-gold-soft text-nahkya-text font-body text-base pb-3 focus:outline-none focus:border-nahkya-gold transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-nahkya-gold-soft text-nahkya-text font-body text-base pb-3 focus:outline-none focus:border-nahkya-gold transition-colors">
                <option>General Inquiry</option>
                <option>Membership</option>
                <option>Press</option>
                <option>Collaboration</option>
                <option>Order Support</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text mb-3">Message</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
                className="w-full bg-transparent border-0 border-b-2 border-nahkya-gold-soft text-nahkya-text font-body text-base pb-3 focus:outline-none focus:border-nahkya-gold transition-colors resize-none" />
            </div>
            <LuxuryButton type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </LuxuryButton>
          </form>
        )}
      </div>
    </div>
  );
}
