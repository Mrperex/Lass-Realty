import type { Metadata } from 'next';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const isEs = locale === 'es';
    return {
        title: isEs ? 'Términos de Servicio | LASS Realty' : 'Terms of Service | LASS Realty',
        description: isEs
            ? 'Términos y condiciones de uso del sitio web de LASS Realty.'
            : 'Terms and conditions for using the LASS Realty website.',
    };
}

export default function TermsOfServicePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const isEs = locale === 'es';

    return (
        <main className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-0">
                <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-[#0a1128] mb-4">
                    {isEs ? 'Términos de Servicio' : 'Terms of Service'}
                </h1>
                <p className="text-sm text-gray-400 font-outfit mb-12">
                    {isEs ? 'Última actualización: 1 de marzo de 2026' : 'Last updated: March 1, 2026'}
                </p>

                <div className="space-y-10 font-outfit text-gray-700 text-base leading-relaxed">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '1. Aceptación de Términos' : '1. Acceptance of Terms'}
                        </h2>
                        <p>{isEs
                            ? 'Al acceder y utilizar el sitio web de LASS Realty (lasspuntacana.com), usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.'
                            : 'By accessing and using the LASS Realty website (lasspuntacana.com), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our website.'}</p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '2. Servicios' : '2. Services'}
                        </h2>
                        <p>{isEs
                            ? 'LASS Realty proporciona una plataforma en línea para la búsqueda de propiedades inmobiliarias de lujo en Punta Cana, República Dominicana. Nuestros servicios incluyen:'
                            : 'LASS Realty provides an online platform for browsing luxury real estate properties in Punta Cana, Dominican Republic. Our services include:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Listados de propiedades en venta y alquiler' : 'Property listings for sale and rent'}</li>
                            <li>{isEs ? 'Guías de vecindarios e informes de mercado' : 'Neighborhood guides and market reports'}</li>
                            <li>{isEs ? 'Conexión con agentes inmobiliarios calificados' : 'Connection with qualified real estate agents'}</li>
                            <li>{isEs ? 'Herramientas de búsqueda y comparación de propiedades' : 'Property search and comparison tools'}</li>
                            <li>{isEs ? 'Calculadoras de hipotecas y retorno de inversión' : 'Mortgage and ROI calculators'}</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '3. Información de Propiedades' : '3. Property Information'}
                        </h2>
                        <p>{isEs
                            ? 'Nos esforzamos por proporcionar información precisa y actualizada sobre todas las propiedades listadas. Sin embargo:'
                            : 'We strive to provide accurate and up-to-date information about all listed properties. However:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Los precios, disponibilidad y detalles están sujetos a cambios sin previo aviso' : 'Prices, availability, and details are subject to change without notice'}</li>
                            <li>{isEs ? 'Las fotografías pueden no reflejar el estado actual de la propiedad' : 'Photographs may not reflect the current condition of the property'}</li>
                            <li>{isEs ? 'Las medidas y dimensiones son aproximadas' : 'Measurements and dimensions are approximate'}</li>
                            <li>{isEs ? 'Los rendimientos de alquiler estimados son orientativos y no garantizados' : 'Estimated rental yields are indicative and not guaranteed'}</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '4. Uso del Sitio Web' : '4. Website Usage'}
                        </h2>
                        <p>{isEs ? 'Al utilizar nuestro sitio web, usted se compromete a:' : 'By using our website, you agree to:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Proporcionar información veraz al completar formularios' : 'Provide truthful information when completing forms'}</li>
                            <li>{isEs ? 'No utilizar el sitio para fines ilegales o fraudulentos' : 'Not use the site for illegal or fraudulent purposes'}</li>
                            <li>{isEs ? 'No copiar, reproducir o redistribuir contenido sin autorización' : 'Not copy, reproduce, or redistribute content without authorization'}</li>
                            <li>{isEs ? 'No intentar acceder a áreas restringidas del sitio' : 'Not attempt to access restricted areas of the site'}</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '5. Propiedad Intelectual' : '5. Intellectual Property'}
                        </h2>
                        <p>{isEs
                            ? 'Todo el contenido del sitio web de LASS Realty, incluyendo textos, fotografías, logotipos, gráficos y diseño, está protegido por leyes de propiedad intelectual. LASS Realty y sus licenciantes son propietarios de todos los derechos de propiedad intelectual del sitio.'
                            : 'All content on the LASS Realty website, including text, photographs, logos, graphics, and design, is protected by intellectual property laws. LASS Realty and its licensors own all intellectual property rights in the site.'}</p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '6. Limitación de Responsabilidad' : '6. Limitation of Liability'}
                        </h2>
                        <p>{isEs
                            ? 'LASS Realty actúa como intermediario y facilitador de información. No somos responsables de:'
                            : 'LASS Realty acts as an intermediary and information facilitator. We are not liable for:'}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{isEs ? 'Decisiones de inversión basadas en la información del sitio' : 'Investment decisions based on site information'}</li>
                            <li>{isEs ? 'El estado o condición de las propiedades listadas' : 'The condition or state of listed properties'}</li>
                            <li>{isEs ? 'Disputas entre compradores y vendedores' : 'Disputes between buyers and sellers'}</li>
                            <li>{isEs ? 'Interrupciones del servicio o errores técnicos' : 'Service interruptions or technical errors'}</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '7. Ley Aplicable' : '7. Governing Law'}
                        </h2>
                        <p>{isEs
                            ? 'Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa que surja de o en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales competentes de la República Dominicana.'
                            : 'These terms are governed by the laws of the Dominican Republic. Any dispute arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts of the Dominican Republic.'}</p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '8. Cambios a estos Términos' : '8. Changes to These Terms'}
                        </h2>
                        <p>{isEs
                            ? 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado del sitio después de los cambios constituye su aceptación de los términos modificados.'
                            : 'We reserve the right to modify these terms at any time. Changes will take effect immediately upon publication on the website. Continued use of the site after changes constitutes your acceptance of the modified terms.'}</p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {isEs ? '9. Contacto' : '9. Contact'}
                        </h2>
                        <p>{isEs
                            ? 'Para preguntas sobre estos términos de servicio, contáctenos:'
                            : 'For questions about these terms of service, contact us:'}</p>
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
