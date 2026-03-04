import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Legal' });
    return {
        title: `${t('termsTitle')} | LASS Realty`,
        description: t('termsDesc'),
    };
}

export default async function TermsOfServicePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = await getTranslations('Terms');

    return (
        <main className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-0">
                <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-[#0a1128] mb-4">
                    {t('title')}
                </h1>
                <p className="text-sm text-gray-400 font-outfit mb-12">
                    {t('lastUpdated')}
                </p>

                <div className="space-y-10 font-outfit text-gray-700 text-base leading-relaxed">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s1_title')}
                        </h2>
                        <p>{t('s1_p')}</p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s2_title')}
                        </h2>
                        <p>{t('s2_p')}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{t('s2_l1')}</li>
                            <li>{t('s2_l2')}</li>
                            <li>{t('s2_l3')}</li>
                            <li>{t('s2_l4')}</li>
                            <li>{t('s2_l5')}</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s3_title')}
                        </h2>
                        <p>{t('s3_p')}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{t('s3_l1')}</li>
                            <li>{t('s3_l2')}</li>
                            <li>{t('s3_l3')}</li>
                            <li>{t('s3_l4')}</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s4_title')}
                        </h2>
                        <p>{t('s4_p')}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{t('s4_l1')}</li>
                            <li>{t('s4_l2')}</li>
                            <li>{t('s4_l3')}</li>
                            <li>{t('s4_l4')}</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s5_title')}
                        </h2>
                        <p>{t('s5_p')}</p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s6_title')}
                        </h2>
                        <p>{t('s6_p')}</p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>{t('s6_l1')}</li>
                            <li>{t('s6_l2')}</li>
                            <li>{t('s6_l3')}</li>
                            <li>{t('s6_l4')}</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s7_title')}
                        </h2>
                        <p>{t('s7_p')}</p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s8_title')}
                        </h2>
                        <p>{t('s8_p')}</p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-xl font-cormorant font-medium text-[#0a1128] mb-3">
                            {t('s9_title')}
                        </h2>
                        <p>{t('s9_p')}</p>
                        <div className="mt-3 bg-slate-50 border border-gray-100 p-6">
                            <p className="font-semibold text-[#0a1128]">LASS Realty</p>
                            <p>Email: info@lasspuntacana.com</p>
                            <p>{t('phone')}</p>
                            <p>Punta Cana, {t('dr')}</p>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
