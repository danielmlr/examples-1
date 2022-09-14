import { getDirectusClient } from '$lib/client';
import { formatRelativeTime } from '../../../../../shared/utils/format-relative-time';

/** @type {import('@sveltejs/kit').PageServerLoad} */
export async function load({ params }) {
	const { id } = params;

	const directus = await getDirectusClient();

	let article;
	try {
		article = await directus.items('articles').readOne(id, {
			fields: ['*', 'author.avatar', 'author.first_name', 'author.last_name']
		});
	} catch (err) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return {
			status: 404
		};
	}

	const formattedArticle = {
		...article,
		publish_date: formatRelativeTime(new Date(article.publish_date))
	};

	const moreArticlesResponse = await directus.items('articles').readByQuery({
		fields: ['*', 'author.avatar', 'author.first_name', 'author.last_name'],
		filter: {
			_and: [{ id: { _neq: article.id } }, { status: { _eq: 'published' } }]
		},
		limit: 2
	});
	const formattedMoreArticles = moreArticlesResponse.data.map((moreArticle) => {
		return {
			...moreArticle,
			publish_date: formatRelativeTime(new Date(moreArticle.publish_date))
		};
	});

	return { article: formattedArticle, moreArticles: formattedMoreArticles };
}
