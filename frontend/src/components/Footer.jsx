import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-lg font-semibold mb-4">WooCommerce Leon</h3>
            <p className="text-gray-300 text-sm mb-4">
              Tu tienda online de confianza para productos de calidad. 
              Ofrecemos la mejor experiencia de compra con entrega rápida y segura.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-4.594 6.814 4.938 4.938 0 00-2.23-.084 4.936 4.936 0 004.604 6.814 9.86 9.86 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058.1.078.22.078.335 0 1.477-.066 2.817-.066 3.584 0 3.226 1.656 4.919 4.919.149.317.078.226.078.335 0 1.181-.012 2.237-.012 3.584 0 3.226-1.656 4.919-4.919.149-.317.07-.226.07-.335 0-1.477-.066-2.817-.066-3.584 0-3.226-1.656-4.919-4.919-.149-.317-.07-.226-.07-.335 0-1.181.012-2.237.012-3.584 0-3.226 1.656-4.919 4.919-.149.317-.07.226-.07.335 0 1.477.066 2.817.066 3.584 0 3.226-1.656 4.919-4.919.149-.317.07-.226.07-.335 0-1.477-.012-2.237-.012-3.584z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">
                Entrega a domicilio
              </li>
              <li className="text-gray-300 text-sm">
                Pago seguro
              </li>
              <li className="text-gray-300 text-sm">
                Devolución fácil
              </li>
              <li className="text-gray-300 text-sm">
                Soporte 24/7
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Guayaquil, Ecuador
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +593 9 8765 4321
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@woocommerce-leon.com
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lun-Vie: 8am-8pm
                <br />
                Sáb: 9am-6pm
              </li>
            </ul>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-sm font-semibold">Métodos de Pago</h4>
            <div className="flex space-x-4">
              <div className="bg-white p-2 rounded">
                <span className="text-blue-600 font-bold">VISA</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-red-600 font-bold">MC</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-blue-800 font-bold">AMEX</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-orange-600 font-bold">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} WooCommerce Leon. Todos los derechos reservados.
          </p>
          <div className="mt-2 space-x-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Política de Devolución
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;