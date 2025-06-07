import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleHero } from "@src/components/features/article";
import { Container } from "@src/components/shared/container";
import TranslationsProvider from "@src/components/shared/i18n/TranslationProvider";
import initTranslations from "@src/i18n";
import { defaultLocale, locales } from "@src/i18n/config";
import { client } from "@src/lib/client";

interface LandingPageProps {
	params: {
		locale: string;
	};
}

export async function generateMetadata({
	params,
}: LandingPageProps): Promise<Metadata> {
	const gqlClient = client;
	const landingPageData = await gqlClient.pageLanding({
		locale: params.locale,
	});
	const page = landingPageData.pageLandingCollection?.items[0];

	const languages = Object.fromEntries(
		locales.map((locale) => [
			locale,
			locale === defaultLocale ? "/" : `/${locale}`,
		]),
	);
	const metadata: Metadata = {
		alternates: {
			canonical: "/",
			languages: languages,
		},
	};
	if (page?.seoFields) {
		metadata.title = page.seoFields.pageTitle;
		metadata.description = page.seoFields.pageDescription;
		metadata.robots = {
			follow: !page.seoFields.nofollow,
			index: !page.seoFields.noindex,
		};
	}

	return metadata;
}

export default async function Page({ params: { locale } }: LandingPageProps) {
	const { resources } = await initTranslations({ locale });
	const gqlClient = client;

	const landingPageData = await gqlClient.pageLanding({ locale });
	const page = landingPageData.pageLandingCollection?.items[0];

	if (!page) {
		notFound();
	}

	if (!page?.featuredBlogPost) {
		return null;
	}

	return (
		<TranslationsProvider locale={locale} resources={resources}>
			<Container>
				<Link href={`/${page.featuredBlogPost.slug}`}>
					<ArticleHero article={page.featuredBlogPost} />
				</Link>
			</Container>
		</TranslationsProvider>
	);
}
