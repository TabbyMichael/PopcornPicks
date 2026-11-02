import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Real submissions go to the backend /api/contact route. Never log PII.
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-netflix-red">Contact</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get in touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Questions, feedback, or just want to talk about movies? We read every message.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border border-white/10 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-foreground">
              <Send className="h-5 w-5 text-netflix-red" />
              Send us a message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-border bg-background"
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-border bg-background"
                  required
                />
              </div>
              <Input
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="border-border bg-background"
                required
              />
              <Textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleInputChange}
                className="min-h-32 border-border bg-background"
                required
              />
              <Button type="submit" variant="primary-red" className="w-full">
                Send message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border border-white/10 bg-card">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red/15">
                <Mail className="h-5 w-5 text-netflix-red" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground">hello@popcornpicks.com</p>
                <p className="mt-1 text-xs text-muted-foreground">We reply within 24 hours.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red/15">
                <Phone className="h-5 w-5 text-netflix-red" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                <p className="mt-1 text-xs text-muted-foreground">Mon–Fri, 9am–5pm PT.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red/15">
                <MapPin className="h-5 w-5 text-netflix-red" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Office</h3>
                <p className="text-sm text-muted-foreground">123 Cinema Avenue</p>
                <p className="text-sm text-muted-foreground">Los Angeles, CA 90001</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red/15">
                <Clock className="h-5 w-5 text-netflix-red" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Support hours</h3>
                <p className="text-sm text-muted-foreground">24/7 for watchlist & playback issues.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-card">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-netflix-red/15">
                <MessageCircle className="h-5 w-5 text-netflix-red" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join the discussion in our <a href="/help-center" className="text-primary hover:underline">Help Center</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
