import { useState, useEffect, useCallback } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  BuildingOffice2Icon,
  StarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const heroPhotos = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg'
];

const venuePhotos = [
  '/photos/venue/venue1.webp',
  '/photos/venue/venue2.jpg'
];

export default function Landing() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [currentVenuePhoto, setCurrentVenuePhoto] = useState(0);

  const nextPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev + 1) % heroPhotos.length);
  }, []);

  const nextVenuePhoto = useCallback(() => {
    setCurrentVenuePhoto((prev) => (prev + 1) % venuePhotos.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextPhoto, 5000);
    return () => clearInterval(interval);
  }, [nextPhoto]);

  useEffect(() => {
    const interval = setInterval(nextVenuePhoto, 4000);
    return () => clearInterval(interval);
  }, [nextVenuePhoto]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Photo carousel background */}
        <div className="absolute inset-0 overflow-hidden">
          {heroPhotos.map((photo, index) => (
            <div
              key={photo}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentPhoto ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Dark burgundy overlay for text readability */}
          <div className="absolute inset-0 bg-primary-900/80"></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          <p className="text-warm-300 font-medium tracking-widest uppercase mb-4">
            Nos Casamos
          </p>

          <h1 className="text-6xl md:text-8xl font-serif text-warm-100 mb-6">
            Lili <span className="text-warm-300">&</span> José
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-warm-400/60"></span>
            <HeartIcon className="h-6 w-6 text-warm-400" />
            <span className="w-16 h-px bg-warm-400/60"></span>
          </div>

          <p className="text-xl md:text-2xl text-warm-200/90 font-light">
            Te invitamos a celebrar nuestra boda
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-warm-400/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-warm-400/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Date & Venue Section */}
      <section className="py-20 px-4 bg-warm-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-primary-900 mb-16">
            Reserva la Fecha
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Fecha</h3>
              <p className="text-primary-800">Sábado</p>
              <p className="text-2xl font-serif text-accent-500">24 de Octubre, 2026</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Hora</h3>
              <p className="text-primary-800">La recepción comienza a las</p>
              <p className="text-2xl font-serif text-accent-500">2:00 PM</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Lugar</h3>
              <p className="text-primary-800">Club Vergel Resort</p>
              <p className="text-2xl font-serif text-accent-500">Bernal, Qro</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-primary-900 mb-8">
            Nuestra Historia
          </h2>

          <div className="space-y-6 text-primary-800 leading-relaxed">
            <p>
              En septiembre de 2022, sin planes ni expectativas, el destino nos reunió en casa de nuestros amigos Julio y Lillian. Entre conversaciones espontáneas, copas de vino y risas compartidas, comenzó a surgir algo especial: una conexión serena pero profunda, de esas que sorprenden por su naturalidad.
            </p>
            <p>
              El tiempo hizo lo suyo y, en diciembre, llegó nuestra primera cita. Fue el inicio de una historia que empezó a escribirse con intención, complicidad y la certeza de que queríamos seguir descubriéndonos.
            </p>
            <p>
              En febrero de 2023, bajo el cielo abierto del semidesierto queretano, mientras esperábamos encontrar el cometa verde, encontramos algo aún más extraordinario: la confirmación de nuestro amor. Entre estrellas y silencio, decidimos caminar juntos. Desde entonces, cada día ha sido una aventura compartida, llena de momentos que nos han hecho crecer y enamorarnos aún más. Y ahora, con el corazón lleno de alegría, queremos invitarte a ser parte de la celebración de nuestro amor.
            </p>
            <p>
              Dos hermosos años después, el hermoso bosque de la Sierra Gorda queretana fue testigo de nuestro compromiso. Rodeados de naturaleza, nuestros perritos Cooper, Harrys, Plaqueta y Molly, reafirmamos la promesa de seguir construyendo esta historia con la misma ilusión del primer día.             
            </p>
            <p>
              Hoy, elegimos el Pueblo Mágico de Bernal como escenario para celebrar nuestro amor. Queremos compartir este momento con las personas que más amamos y comenzar una nueva etapa, acompañados de quienes han sido parte esencial de nuestro camino.
            </p>
          </div>

          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-serif text-accent-500">2022</p>
              <p className="text-sm text-gray-500 mt-1">Nos Conocimos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif text-accent-500">2025</p>
              <p className="text-sm text-gray-500 mt-1">Compromiso</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif text-accent-500">2026</p>
              <p className="text-sm text-gray-500 mt-1">Boda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Details Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-primary-900 mb-12">
            El Lugar
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-lg h-64 md:h-80 overflow-hidden">
              {venuePhotos.map((photo, index) => (
                <img
                  key={photo}
                  src={photo}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentVenuePhoto ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-serif text-primary-900 mb-4">
                Club Vergel Resort
              </h3>
              <p className="text-primary-800 mb-6">
                Ubicado en Bernal, Querétaro, Club Vergel Resort ofrece un entorno
                romántico y elegante con vistas a la majestuosa Peña de Bernal.
                Con sus hermosos jardines y ambiente único, es el lugar perfecto
                para celebrar nuestro amor.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary-900 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary-900">Dirección</p>
                    <p className="text-primary-800">Bernal, Querétaro</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/YXjD24JJBPs38Akh6?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-accent-500 hover:text-accent-600 font-medium"
              >
                <MapPinIcon className="h-5 w-5" />
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-primary-900 mb-12">
            Dónde Hospedarte
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Hotel Quinta Arantxa',
                address: 'Calle Ezequiel Montes 10, Barrio La Capilla, Bernal',
                distance: '3 min caminando al centro',
                priceRange: '$$',
                rating: 9.4,
                features: ['Vista a la Peña', 'Jardín y terraza'],
                mapsUrl: 'https://www.google.com/maps/search/Hotel+Quinta+Arantxa+Bernal+Querétaro',
                bookingUrl: 'https://www.booking.com/hotel/mx/quinta-arantxa.html',
              },
              {
                name: 'Hotel de Piedra',
                address: 'Calle de la Corregidora No. 67, Bernal',
                distance: 'En el centro de Bernal',
                priceRange: '$$$',
                rating: 8.7,
                features: ['Spa y wellness', 'Vinícola y biblioteca'],
                mapsUrl: 'https://www.google.com/maps/search/Hotel+de+Piedra+Bernal+Querétaro',
                bookingUrl: 'https://www.booking.com/hotel/mx/de-piedra.html',
              },
              {
                name: 'Casa Mateo Hotel Boutique',
                address: '5 de Mayo esquina Colón, Bernal',
                distance: 'En el centro de Bernal',
                priceRange: '$$$',
                rating: 8.4,
                features: ['Edificio colonial s. XVIII', 'Terraza con vinos'],
                mapsUrl: 'https://www.google.com/maps/search/Casa+Mateo+Hotel+Boutique+Bernal+Querétaro',
                bookingUrl: 'https://www.booking.com/hotel/mx/casa-mateo-boutique.html',
              },
              {
                name: 'Suites Campestres Montebello',
                address: 'Antiguo Camino a Bernal s/n, Bernal',
                distance: '~9 km del centro',
                priceRange: '$$$',
                rating: 9.0,
                features: ['Alberca', 'Restaurante y cocina'],
                mapsUrl: 'https://www.google.com/maps/search/Suites+Campestres+Montebello+Bernal+Querétaro',
                bookingUrl: 'https://www.booking.com/hotel/mx/montebello-bernal.html',
              },
              {
                name: 'Cabañas Rancho San Jorge',
                address: 'Carretera Colón-Bernal s/n, Bernal',
                distance: '5 min en auto del centro',
                priceRange: '$$',
                rating: 8.4,
                features: ['Cabañas con chimenea', 'Vista panorámica'],
                mapsUrl: 'https://www.google.com/maps/search/Cabañas+Rancho+San+Jorge+Bernal+Querétaro',
                bookingUrl: 'https://www.booking.com/hotel/mx/cabanas-rancho-san-jorge.html',
              },
            ].map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-950 rounded-lg flex items-center justify-center shrink-0">
                    <BuildingOffice2Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary-900">{hotel.name}</h3>
                      <span className="text-primary-900 font-medium">{hotel.priceRange}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-primary-800">
                        <MapPinIcon className="h-4 w-4" />
                        {hotel.distance}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-primary-800">
                        <StarIcon className="h-4 w-4 text-warm-400" />
                        {hotel.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {hotel.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs bg-warm-50 text-warm-700 px-2 py-1 rounded-full"
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
                        className="inline-flex items-center gap-1 text-sm text-primary-800 hover:text-accent-500 transition-colors"
                      >
                        <MapPinIcon className="h-4 w-4" />
                        Ver Mapa
                      </a>
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors"
                      >
                        Reservar →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-primary-900 mb-12">
            Programa del Día
          </h2>

          <div className="space-y-0">
            {[
              { time: '2:00 PM', event: 'Recepción', description: 'Llegada de invitados y bienvenida' },
              { time: '2:30 PM', event: 'Ceremonia', description: 'Intercambio de votos' },
              { time: '4:00 PM', event: '¡Inicia la pachanga!', description: 'Comida, música, baile y celebración' },
              { time: '12:00 AM', event: 'Fin del evento', description: 'Gracias por celebrar con nosotros' },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary-900 rounded-full"></div>
                  {index < 3 && <div className="w-0.5 h-16 bg-primary-200"></div>}
                </div>
                <div className="pb-8">
                  <p className="text-sm font-medium text-accent-500">{item.time}</p>
                  <h4 className="text-lg font-semibold text-primary-900">{item.event}</h4>
                  <p className="text-primary-800">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-primary-900 mb-8">
            Código de Vestimenta
          </h2>

          <div className="bg-warm-100 rounded-2xl p-8">
            <p className="text-2xl font-serif text-primary-900 mb-4">
              Vestido Cóctel y Guayabera
            </p>
            <p className="text-primary-800">
              Queremos que se sientan cómodos, por lo que pueden llevar
              tenis o zapatos cómodos.
            </p>
            <p className="text-primary-700 mt-4 text-sm">
              Este es un evento para mayores de 15 años, por lo que esperamos
              entiendas que los pequeños se quedan en casa.
            </p>
          </div>
        </div>
      </section>

      {/* Gift Registry Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-primary-900 mb-4">
            Mesa de Regalos
          </h2>
          <p className="text-primary-800 mb-12 max-w-xl mx-auto">
            Tu presencia es el mejor regalo, pero cualquier detalle te lo agradeceremos de corazón
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <BanknotesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Transferencia Bancaria</h3>
              <div className="text-left bg-warm-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Banco:</span>
                  <span className="font-medium text-primary-900">BBVA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Titular:</span>
                  <span className="font-medium text-primary-900">LILIANA MEDINA GUZMAN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">CLABE:</span>
                  <span className="font-medium text-primary-900">012 680 02976925251 7</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <BanknotesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Transferencia Bancaria</h3>
              <div className="text-left bg-warm-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Banco:</span>
                  <span className="font-medium text-primary-900">SANTANDER</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Titular:</span>
                  <span className="font-medium text-primary-900">JOSE CARLOS CRUCET</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">CLABE:</span>
                  <span className="font-medium text-primary-900">014 680 60607937439 9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Lili & José</h2>
          <p className="text-warm-300 mb-6">24 de Octubre, 2026</p>

          <div className="flex items-center justify-center gap-4">
            <span className="w-16 h-px bg-primary-800"></span>
            <HeartIcon className="h-5 w-5 text-warm-400" />
            <span className="w-16 h-px bg-primary-800"></span>
          </div>

          <p className="mt-6 text-primary-300 text-sm">
            Si tienes alguna pregunta, contáctanos en{' '}
            <a href="mailto:liliyjose@bodaliliyjose.com" className="text-accent-400 hover:text-accent-300">
              liliyjose@bodaliliyjose.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
