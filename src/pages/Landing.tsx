import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          <p className="text-primary-600 font-medium tracking-widest uppercase mb-4">
            We're Getting Married!
          </p>

          <h1 className="text-6xl md:text-8xl font-serif text-gray-900 mb-6">
            Lili <span className="text-primary-500">&</span> José
          </h1>

          <div className="flex items-center justify-center gap-4 text-gray-600 mb-8">
            <span className="w-16 h-px bg-gray-300"></span>
            <HeartIcon className="h-6 w-6 text-primary-500" />
            <span className="w-16 h-px bg-gray-300"></span>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 font-light">
            Together with our families, we invite you to celebrate our wedding
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Date & Venue Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-16">
            Save the Date
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Date</h3>
              <p className="text-gray-600">Saturday</p>
              <p className="text-2xl font-serif text-primary-600">June 15, 2026</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time</h3>
              <p className="text-gray-600">Ceremony begins at</p>
              <p className="text-2xl font-serif text-primary-600">4:00 PM</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue</h3>
              <p className="text-gray-600">Hacienda Los Sueños</p>
              <p className="text-2xl font-serif text-primary-600">Mexico City</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
            Our Story
          </h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              We met on a beautiful autumn day in 2020, and from that moment, we knew
              there was something special between us. What started as a simple coffee
              date turned into countless adventures, shared dreams, and a love that
              grows stronger every day.
            </p>
            <p>
              After four wonderful years together, we're thrilled to begin this new
              chapter of our lives surrounded by the people we love most. We can't
              wait to celebrate with you!
            </p>
          </div>

          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-serif text-primary-600">2020</p>
              <p className="text-sm text-gray-500 mt-1">First Met</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif text-primary-600">2024</p>
              <p className="text-sm text-gray-500 mt-1">Engaged</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif text-primary-600">2026</p>
              <p className="text-sm text-gray-500 mt-1">Wedding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Details Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
            The Venue
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
              <span className="text-gray-500">Venue Photo</span>
            </div>

            <div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">
                Hacienda Los Sueños
              </h3>
              <p className="text-gray-600 mb-6">
                Nestled in the heart of Mexico City, Hacienda Los Sueños offers a
                romantic and elegant setting for our special day. With its beautiful
                gardens, historic architecture, and stunning views, it's the perfect
                place to celebrate our love.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">123 Avenida Principal, Col. Centro</p>
                    <p className="text-gray-600">Mexico City, CDMX 06000</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-primary-600 hover:text-primary-700 font-medium"
              >
                <MapPinIcon className="h-5 w-5" />
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
            Wedding Day Schedule
          </h2>

          <div className="space-y-0">
            {[
              { time: '4:00 PM', event: 'Guest Arrival', description: 'Welcome drinks and seating' },
              { time: '4:30 PM', event: 'Ceremony', description: 'Exchange of vows' },
              { time: '5:30 PM', event: 'Cocktail Hour', description: 'Appetizers and drinks in the garden' },
              { time: '7:00 PM', event: 'Reception', description: 'Dinner, toasts, and celebration' },
              { time: '9:00 PM', event: 'Dancing', description: 'Party time!' },
              { time: '12:00 AM', event: 'Farewell', description: 'Thank you for celebrating with us' },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
                  {index < 5 && <div className="w-0.5 h-16 bg-primary-200"></div>}
                </div>
                <div className="pb-8">
                  <p className="text-sm font-medium text-primary-600">{item.time}</p>
                  <h4 className="text-lg font-semibold text-gray-900">{item.event}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
            Dress Code
          </h2>

          <div className="bg-primary-50 rounded-2xl p-8">
            <p className="text-2xl font-serif text-primary-700 mb-4">
              Formal / Black Tie Optional
            </p>
            <p className="text-gray-600">
              We kindly request that guests dress in formal attire.
              Gentlemen are encouraged to wear suits or tuxedos, and ladies
              may wear floor-length gowns or elegant cocktail dresses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Lili & José</h2>
          <p className="text-gray-400 mb-6">June 15, 2026</p>

          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span className="w-16 h-px bg-gray-700"></span>
            <HeartIcon className="h-5 w-5 text-primary-400" />
            <span className="w-16 h-px bg-gray-700"></span>
          </div>

          <p className="mt-6 text-gray-500 text-sm">
            If you have any questions, please contact us at{' '}
            <a href="mailto:liliyjose@bodaliliyjose.com" className="text-primary-400 hover:text-primary-300">
              liliyjose@bodaliliyjose.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
