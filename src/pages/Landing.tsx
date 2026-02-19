import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  BuildingOffice2Icon,
  StarIcon,
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
            Nos Casamos
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
            Junto a nuestras familias, te invitamos a celebrar nuestra boda
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
            Reserva la Fecha
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fecha</h3>
              <p className="text-gray-600">Sábado</p>
              <p className="text-2xl font-serif text-primary-600">15 de Junio, 2026</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hora</h3>
              <p className="text-gray-600">La ceremonia comienza a las</p>
              <p className="text-2xl font-serif text-primary-600">4:00 PM</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lugar</h3>
              <p className="text-gray-600">Hacienda Los Sueños</p>
              <p className="text-2xl font-serif text-primary-600">Ciudad de México</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
            Nuestra Historia
          </h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Nos conocimos en un hermoso día de otoño en 2020, y desde ese momento
              supimos que había algo especial entre nosotros. Lo que comenzó como una
              simple cita de café se convirtió en incontables aventuras, sueños
              compartidos y un amor que crece más fuerte cada día.
            </p>
            <p>
              Después de cuatro maravillosos años juntos, estamos emocionados de
              comenzar este nuevo capítulo de nuestras vidas rodeados de las personas
              que más queremos. ¡No podemos esperar para celebrar contigo!
            </p>
          </div>

          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-serif text-primary-600">2020</p>
              <p className="text-sm text-gray-500 mt-1">Nos Conocimos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif text-primary-600">2024</p>
              <p className="text-sm text-gray-500 mt-1">Compromiso</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif text-primary-600">2026</p>
              <p className="text-sm text-gray-500 mt-1">Boda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Details Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
            El Lugar
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
              <span className="text-gray-500">Foto del Lugar</span>
            </div>

            <div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">
                Hacienda Los Sueños
              </h3>
              <p className="text-gray-600 mb-6">
                Ubicada en el corazón de la Ciudad de México, Hacienda Los Sueños
                ofrece un entorno romántico y elegante para nuestro día especial.
                Con sus hermosos jardines, arquitectura histórica y vistas
                impresionantes, es el lugar perfecto para celebrar nuestro amor.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Dirección</p>
                    <p className="text-gray-600">123 Avenida Principal, Col. Centro</p>
                    <p className="text-gray-600">Ciudad de México, CDMX 06000</p>
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
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-4">
            Dónde Hospedarte
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Hemos conseguido tarifas especiales en hoteles cercanos. Aquí están nuestras mejores recomendaciones para tu estancia.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Hotel Condesa DF',
                address: 'Av. Veracruz 102, Condesa',
                distance: '10 min del lugar',
                priceRange: '$$$',
                rating: 4.8,
                features: ['Terraza bar', 'Desayuno incluido'],
                mapsUrl: 'https://maps.google.com/?q=Hotel+Condesa+DF+Mexico+City',
                bookingUrl: 'https://www.booking.com/hotel/mx/condesa-df.html',
              },
              {
                name: 'Gran Hotel Ciudad de México',
                address: 'Av. 16 de Septiembre 82, Centro',
                distance: '15 min del lugar',
                priceRange: '$$$$',
                rating: 4.9,
                features: ['Edificio histórico', 'Spa'],
                mapsUrl: 'https://maps.google.com/?q=Gran+Hotel+Ciudad+de+Mexico',
                bookingUrl: 'https://www.booking.com/hotel/mx/gran-ciudad-de-mexico.html',
              },
              {
                name: 'Hotel Carlota',
                address: 'Río Amazonas 73, Cuauhtémoc',
                distance: '12 min del lugar',
                priceRange: '$$',
                rating: 4.5,
                features: ['Alberca', 'Diseño moderno'],
                mapsUrl: 'https://maps.google.com/?q=Hotel+Carlota+Mexico+City',
                bookingUrl: 'https://www.booking.com/hotel/mx/carlota.html',
              },
              {
                name: 'Fiesta Americana Reforma',
                address: 'Paseo de la Reforma 80',
                distance: '20 min del lugar',
                priceRange: '$$$',
                rating: 4.6,
                features: ['Centro de negocios', 'Gimnasio'],
                mapsUrl: 'https://maps.google.com/?q=Fiesta+Americana+Reforma+Mexico+City',
                bookingUrl: 'https://www.booking.com/hotel/mx/fiesta-americana-reforma.html',
              },
            ].map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                    <BuildingOffice2Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                      <span className="text-primary-600 font-medium">{hotel.priceRange}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        {hotel.distance}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                        {hotel.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {hotel.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                      <a
                        href={hotel.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <MapPinIcon className="h-4 w-4" />
                        Ver Mapa
                      </a>
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Reservar →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Menciona "Boda Lili & José" al reservar para obtener tarifas especiales.
          </p>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
            Programa del Día
          </h2>

          <div className="space-y-0">
            {[
              { time: '4:00 PM', event: 'Llegada de Invitados', description: 'Bebidas de bienvenida y ubicación' },
              { time: '4:30 PM', event: 'Ceremonia', description: 'Intercambio de votos' },
              { time: '5:30 PM', event: 'Hora del Cóctel', description: 'Aperitivos y bebidas en el jardín' },
              { time: '7:00 PM', event: 'Recepción', description: 'Cena, brindis y celebración' },
              { time: '9:00 PM', event: 'Baile', description: '¡A bailar!' },
              { time: '12:00 AM', event: 'Despedida', description: 'Gracias por celebrar con nosotros' },
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
            Código de Vestimenta
          </h2>

          <div className="bg-primary-50 rounded-2xl p-8">
            <p className="text-2xl font-serif text-primary-700 mb-4">
              Formal / Etiqueta Opcional
            </p>
            <p className="text-gray-600">
              Les pedimos amablemente asistir con vestimenta formal.
              Los caballeros pueden usar traje o esmoquin, y las damas
              vestidos largos o de cóctel elegantes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Lili & José</h2>
          <p className="text-gray-400 mb-6">15 de Junio, 2026</p>

          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span className="w-16 h-px bg-gray-700"></span>
            <HeartIcon className="h-5 w-5 text-primary-400" />
            <span className="w-16 h-px bg-gray-700"></span>
          </div>

          <p className="mt-6 text-gray-500 text-sm">
            Si tienes alguna pregunta, contáctanos en{' '}
            <a href="mailto:liliyjose@bodaliliyjose.com" className="text-primary-400 hover:text-primary-300">
              liliyjose@bodaliliyjose.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
