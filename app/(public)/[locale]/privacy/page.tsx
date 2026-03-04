import type { Metadata } from 'next';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const isEs = locale === 'es';
    return {
        title: isEs ? 'Política de Privacidad | LASS Realty' : 'Privacy Policy | LASS Realty',
        description: isEs
            ? 'Política de privacidad de LASS Realty. Cómo recopilamos, usamos y protegemos su información personal.'
            : 'LASS Realty privacy policy. How we collect, use, and protect your personal information.',
    };
}

export default function PrivacyPolicyPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const isEs = locale === 'es';

    return (
        <main className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-0">
                <h1 className="text-4xl md:text-5xl font-playfair font-medium text-[#0a1128] mb-4">
                    {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
                </h1>
                <p className="text-sm text-gray-400 font-outfit mb-12">
                    {isEs ? 'Última actualización: 1 de marzo de 2026' : 'Last updated: March 1, 2026'}
                </p>

                <div className="space-y-10 font-outfit text-gray-700 text-base leading-relaxed">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '1. Información que Recopilamos' : '1. Information We Collect'}
                        </h2>
                        <p>{isEs
                            ? 'LASS Realty ("nosotros", "nuestro") recopila información que usted proporiona voluntariamente al usar nuestro sitio web, incluyendo:'
                            : 'LASS Realty ("we", "our", "us") collects information you voluntarily provide when using our website, including:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Nombre completo y correo electrónico (formularios de contacto, descarga de informes)' : 'Full name and email address (contact forms, report downloads)'}</li>
                            <li>{isEs ? 'Número de teléfono (formularios de consulta de propiedades)' : 'Phone number (property inquiry forms)'}</li>
                            <li>{isEs ? 'Preferencias de búsqueda de propiedades' : 'Property search preferences'}</li>
                            <li>{isEs ? 'Datos de navegación y cookies (ver sección de Cookies)' : 'Browsing data and cookies (see Cookies section)'}</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '2. Cómo Usamos su Información' : '2. How We Use Your Information'}
                        </h2>
                        <p>{isEs ? 'Utilizamos la información recopilada para:' : 'We use collected information to:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Responder a sus consultas sobre propiedades' : 'Respond to your property inquiries'}</li>
                            <li>{isEs ? 'Enviar informes de mercado solicitados' : 'Send requested market reports'}</li>
                            <li>{isEs ? 'Conectarlo con agentes calificados' : 'Connect you with qualified agents'}</li>
                            <li>{isEs ? 'Personalizar su experiencia de búsqueda' : 'Personalize your search experience'}</li>
                            <li>{isEs ? 'Mejorar nuestros servicios y contenido del sitio web' : 'Improve our services and website content'}</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '3. Protección de Datos' : '3. Data Protection'}
                        </h2>
                        <p>{isEs
                            ? 'Implementamos medidas de seguridad estándar de la industria, incluyendo cifrado SSL/TLS, autenticación segura y almacenamiento encriptado de datos. Su información personal nunca se vende a terceros.'
                            : 'We implement industry-standard security measures including SSL/TLS encryption, secure authentication, and encrypted data storage. Your personal information is never sold to third parties.'}</p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '4. Cookies y Tecnologías de Seguimiento' : '4. Cookies & Tracking Technologies'}
                        </h2>
                        <p>{isEs
                            ? 'Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Esto incluye:'
                            : 'Our website uses cookies to enhance your browsing experience. This includes:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li><strong>{isEs ? 'Cookies esenciales:' : 'Essential cookies:'}</strong> {isEs ? 'Necesarias para el funcionamiento del sitio (preferencias de idioma, moneda)' : 'Required for site functionality (language, currency preferences)'}</li>
                            <li><strong>{isEs ? 'Cookies analíticas:' : 'Analytics cookies:'}</strong> {isEs ? 'Google Analytics 4 para análisis de tráfico anónimo' : 'Google Analytics 4 for anonymous traffic analysis'}</li>
                            <li><strong>{isEs ? 'Cookies de rendimiento:' : 'Performance cookies:'}</strong> {isEs ? 'Mejoran la velocidad de carga y experiencia del usuario' : 'Improve loading speed and user experience'}</li>
                        </ul>
                        <p className="mt-3">{isEs
                            ? 'Puede gestionar sus preferencias de cookies en cualquier momento a través de la configuración de su navegador.'
                            : 'You can manage your cookie preferences at any time through your browser settings.'}</p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '5. Servicios de Terceros' : '5. Third-Party Services'}
                        </h2>
                        <p>{isEs
                            ? 'Utilizamos los siguientes servicios de terceros que pueden recopilar datos de acuerdo con sus propias políticas de privacidad:'
                            : 'We use the following third-party services that may collect data according to their own privacy policies:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Google Analytics (análisis de tráfico)' : 'Google Analytics (traffic analysis)'}</li>
                            <li>{isEs ? 'Cloudinary (alojamiento de imágenes)' : 'Cloudinary (image hosting)'}</li>
                            <li>{isEs ? 'Vercel (alojamiento del sitio web)' : 'Vercel (website hosting)'}</li>
                            <li>{isEs ? 'MongoDB Atlas (almacenamiento de datos)' : 'MongoDB Atlas (data storage)'}</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '6. Sus Derechos' : '6. Your Rights'}
                        </h2>
                        <p>{isEs
                            ? 'De acuerdo con la Ley 172-13 de Protección de Datos Personales de la República Dominicana y regulaciones internacionales aplicables, usted tiene derecho a:'
                            : 'In accordance with Dominican Republic Data Protection Law 172-13 and applicable international regulations, you have the right to:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Acceder a los datos personales que tenemos sobre usted' : 'Access the personal data we hold about you'}</li>
                            <li>{isEs ? 'Solicitar corrección de datos inexactos' : 'Request correction of inaccurate data'}</li>
                            <li>{isEs ? 'Solicitar eliminación de sus datos' : 'Request deletion of your data'}</li>
                            <li>{isEs ? 'Retirar su consentimiento en cualquier momento' : 'Withdraw your consent at any time'}</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl font-playfair font-medium text-[#0a1128] mb-3">
                            {isEs ? '7. Contacto' : '7. Contact'}
                        </h2>
                        <p>{isEs
                            ? 'Para preguntas sobre esta política de privacidad o para ejercer sus derechos de datos, contáctenos:'
                            : 'For questions about this privacy policy or to exercise your data rights, contact us:'}</p>
                        <div className="mt-3 bg-slate-50 border border-gray-100 p-6">
                            <p className="font-semibold text-[#0a1128]">LASS Realty</p>
                            <p>Email: info@lasspuntacana.com</p>
                            <p>{isEs ? 'Teléfono: +1 (809) 555-0100' : 'Phone: +1 (809) 555-0100'}</p>
                            <p>Punta Cana, {isEs ? 'República Dominicana' : 'Dominican Republic'}</p>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
