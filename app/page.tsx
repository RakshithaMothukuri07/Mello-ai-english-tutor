"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Sparkles, LineChart, Mic, Users, Globe, ArrowRight, CheckCircle, Play } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/mello/navbar';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: MessageSquare, title: "Continuous AI conversation", description: "Natural, multi-turn dialogues" },
    { icon: Sparkles, title: "Feedback & performance", description: "Fluency scoring and suggestions" },
    { icon: LineChart, title: "Track progress", description: "Review and improve over time" }
  ];

  const stats = [
    { number: "10k+", label: "Active Learners" },
    { number: "50k+", label: "Conversations" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  const learningPaths = [
    { icon: Users, title: "Business English", description: "Professional communication skills" },
    { icon: Globe, title: "Travel English", description: "Essential phrases for travelers" },
    { icon: MessageSquare, title: "Daily Conversation", description: "Everyday speaking practice" },
    { icon: Mic, title: "Pronunciation", description: "Perfect your accent" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <Navbar/>
      <main className="mx-auto max-w-6xl px-4">
        <section className={`mx-auto max-w-3xl text-center py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✨ AI-Powered English Practice
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
            Speak English with confidence — judgment-free
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Practice English conversations with AI and get instant, gentle feedback. Build fluency through natural dialogue, anytime, anywhere.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard/practice">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 group">
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 group">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
        </section>

        <section className="py-12 border-y bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to master English
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools to improve your speaking, listening, and confidence.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              return (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-500 hover:scale-105 ${
                    isActive ? 'shadow-xl border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' : 'hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                      </div>
                      <span className={isActive ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : ''}>
                        {feature.title}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    {feature.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Learning Paths */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 -mx-4 px-4 rounded-3xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Choose your learning path
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Tailored conversation topics for your specific goals
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {learningPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white cursor-pointer">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    {path.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Start speaking in minutes
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Simple steps to begin your English learning journey
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Choose a topic", description: "Pick from business, travel, daily life, and more" },
              { step: "2", title: "Start conversation", description: "Speak naturally with our AI conversation partner" },
              { step: "3", title: "Get feedback", description: "Receive personalized tips to improve your fluency" }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-300 to-pink-300" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 text-center bg-gradient-to-r from-purple-600 to-pink-600 -mx-4 px-4 rounded-3xl text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to speak with confidence?
          </h2>
          <p className="text-lg mb-8 text-purple-100">
            Join thousands of learners improving their English every day
          </p>
          <Link href="/dashboard/practice">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-purple-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Cancel anytime
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Mello
              </h3>
              <p className="text-sm text-gray-600">
                AI-powered English conversation practice for confident speakers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Mello. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}