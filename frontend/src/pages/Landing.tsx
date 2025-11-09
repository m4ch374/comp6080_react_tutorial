import { Sparkles, Zap, Brain, Shield, ArrowRight } from 'lucide-react'
import { Spotlight } from '@/components/ui/Spotlight'
import { CardStack } from '@/components/ui/CardStack'
import { InfiniteMovingCards } from '@/components/ui/InfiniteMovingCards'
import { Link } from 'react-router'

const Landing = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-indigo-50/30 dark:from-black dark:via-black dark:to-indigo-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#818cf8"
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Advanced AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="text-zinc-900 dark:text-zinc-100">
                Intelligent Solutions
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Transform your workflow with cutting-edge AI technology.
              Experience the next generation of intelligent automation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/20 transition-all duration-200 hover:scale-105"
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 cursor-pointer"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  99.9%
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Uptime
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  10M+
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Tasks Processed
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  50K+
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Active Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 sm:p-12">
          {/* Animated Dot Grid Background */}
          <div
            className="absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              maskImage:
                'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
            }}
          />

          {/* Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-30 blur-3xl animate-pulse" />
            <div
              className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-500 opacity-30 blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-500 opacity-20 blur-3xl animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </div>

          {/* Mesh Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-60 dark:opacity-40"
            style={{
              background:
                'radial-gradient(at 27% 37%, rgb(139, 92, 246) 0px, transparent 50%), radial-gradient(at 97% 21%, rgb(99, 102, 241) 0px, transparent 50%), radial-gradient(at 52% 99%, rgb(236, 72, 153) 0px, transparent 50%), radial-gradient(at 10% 29%, rgb(59, 130, 246) 0px, transparent 50%), radial-gradient(at 97% 96%, rgb(168, 85, 247) 0px, transparent 50%), radial-gradient(at 33% 50%, rgb(99, 102, 241) 0px, transparent 50%), radial-gradient(at 79% 53%, rgb(236, 72, 153) 0px, transparent 50%)',
            }}
          />

          <div className="relative text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include a 14-day
              free trial.
            </p>
            <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/20 hover:scale-105 transition-transform duration-200">
              View Pricing Plans
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Built for the future, designed for today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative p-8 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Lightning Fast
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Process millions of requests in seconds with our optimized AI
              infrastructure.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative p-8 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Intelligent Learning
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Advanced machine learning models that adapt and improve over time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative p-8 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Enterprise Security
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Bank-level encryption and security protocols to keep your data
              safe.
            </p>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/20 transition-all duration-200 hover:scale-105">
            View Our Pricing Plans
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Testimonials Section with CardStack */}
      <div
        id="testimonials"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            See what our users are saying about their experience
          </p>
        </div>
        <div className="flex justify-center items-center">
          <CardStack
            items={[
              {
                id: 1,
                name: 'Sarah Chen',
                designation: 'CTO at TechCorp',
                content: (
                  <p>
                    This platform has completely transformed how we handle our
                    AI workflows. The speed and reliability are unmatched.
                  </p>
                ),
              },
              {
                id: 2,
                name: 'Michael Rodriguez',
                designation: 'Lead Engineer',
                content: (
                  <p>
                    The intelligent learning capabilities are incredible. It
                    adapts to our needs and gets better every day.
                  </p>
                ),
              },
              {
                id: 3,
                name: 'Emily Watson',
                designation: 'Product Manager',
                content: (
                  <p>
                    Best investment we've made. The ROI has been phenomenal and
                    our team productivity has increased by 300%.
                  </p>
                ),
              },
              {
                id: 4,
                name: 'David Kim',
                designation: 'Founder & CEO',
                content: (
                  <p>
                    Enterprise-grade security with startup-level innovation.
                    This is exactly what we needed to scale.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Infinite Moving Cards - Company Logos/Testimonials */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Trusted by Industry Leaders
          </h2>
        </div>
        <InfiniteMovingCards
          items={[
            {
              quote:
                'Revolutionary AI platform that exceeded all our expectations.',
              name: 'Google',
              title: 'Tech Giant',
            },
            {
              quote:
                'The best AI solution we have integrated into our workflow.',
              name: 'Microsoft',
              title: 'Enterprise Partner',
            },
            {
              quote: 'Transformed our entire data processing pipeline.',
              name: 'Amazon',
              title: 'Cloud Leader',
            },
            {
              quote: 'Incredible performance and reliability at scale.',
              name: 'Meta',
              title: 'Social Platform',
            },
            {
              quote: 'The future of intelligent automation is here.',
              name: 'Netflix',
              title: 'Streaming Service',
            },
          ]}
          direction="right"
          speed="slow"
        />
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 sm:p-16">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using our AI platform to
              streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-200">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            <p>© 2024 AI Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
