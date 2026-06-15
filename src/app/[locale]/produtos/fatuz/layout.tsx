import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const title = locale === 'pt'
        ? 'Fatuz — Sistema de gestão financeira | Palaz Strategy Company'
        : 'Fatuz — Financial management system | Palaz Strategy Company';
    const description = locale === 'pt'
        ? 'Fatuz é o sistema de gestão financeira inteligente criado pela Palaz. Faturas, PIX, controle de lucro e orçamentos em um só lugar.'
        : 'Fatuz is the intelligent financial management system created by Palaz. Invoices, PIX, profit control and budgets in one place.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://palaz.com.br/${locale}/produtos/fatuz`,
            type: 'website',
        },
        alternates: {
            canonical: locale === 'pt' ? `/produtos/fatuz` : `/${locale}/produtos/fatuz`,
            languages: {
                'pt-BR': `/produtos/fatuz`,
                'en-US': `/en/produtos/fatuz`,
                'x-default': `/produtos/fatuz`,
            },
        },
    };
}

export default function FatuzLayout({ children }: { children: React.ReactNode }) {
    return children;
}
