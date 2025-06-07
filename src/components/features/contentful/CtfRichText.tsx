import {
	documentToReactComponents,
	type Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, type Document } from "@contentful/rich-text-types";

import { ArticleImage, ArticleVideo } from "@src/components/features/article";
import type {
	ComponentRichImage,
	RichVideo,
	PageBlogPostContentLinks,
} from "@src/lib/__generated/sdk";

export type EmbeddedEntryType = ComponentRichImage | RichVideo | null;

export interface ContentfulRichTextInterface {
	json: Document;
	links?:
		| {
				entries: {
					block: Array<EmbeddedEntryType>;
				};
		  }
		| unknown;
}

export const EmbeddedEntry = (entry: EmbeddedEntryType) => {
	switch (entry?.__typename) {
		case "ComponentRichImage":
			return <ArticleImage image={entry} />;
		case "RichVideo":
			return <ArticleVideo video={entry} />;
		default:
			return null;
	}
};

export const contentfulBaseRichTextOptions = ({
	links,
}: ContentfulRichTextInterface): Options => ({
	renderNode: {
		[BLOCKS.EMBEDDED_ENTRY]: (node) => {
			const entry = (links as PageBlogPostContentLinks)?.entries?.block?.find(
				(item) => item?.sys?.id === node.data.target.sys.id,
			) as EmbeddedEntryType;

			if (!entry) return null;

			return <EmbeddedEntry {...entry} />;
		},
	},
});

export const CtfRichText = ({ json, links }: ContentfulRichTextInterface) => {
	const baseOptions = contentfulBaseRichTextOptions({ links, json });

	return (
		<article className="prose prose-sm max-w-none">
			{documentToReactComponents(json, baseOptions)}
		</article>
	);
};
