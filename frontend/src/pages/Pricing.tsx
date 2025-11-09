import Navbar from '@/components/Navbar'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals and small teams getting started',
      features: [
        'Up to 10,000 requests/month',
        'Basic AI models',
        'Email support',
        'Standard analytics',
        'API access',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing businesses with higher demands',
      features: [
        'Up to 100,000 requests/month',
        'Advanced AI models',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        '99.9% uptime SLA',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with specific requirements',
      features: [
        'Unlimited requests',
        'Premium AI models',
        '24/7 dedicated support',
        'Custom analytics',
        'API access',
        'Custom integrations',
        '99.99% uptime SLA',
        'Dedicated account manager',
        'Custom training',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-indigo-50/30 dark:from-black dark:via-black dark:to-indigo-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
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
              <span>Simple, Transparent Pricing</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Select the perfect plan for your needs. All plans include our core
              features with no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-500 dark:border-indigo-400 shadow-xl shadow-indigo-500/20 dark:shadow-indigo-500/10 scale-105'
                  : 'bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-zinc-600 dark:text-zinc-400 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/20 hover:scale-105'
                    : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
                }`}
              >
                {plan.cta}
                <ArrowRight className="inline-block h-4 w-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Can I change plans later?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will be reflected in your next billing cycle.
            </p>
          </div>

          <div className="p-6 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Yes, all plans come with a 14-day free trial. No credit card
              required to start.
            </p>
          </div>

          <div className="p-6 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              We accept all major credit cards, PayPal, and bank transfers for
              Enterprise plans.
            </p>
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

export default Pricing
