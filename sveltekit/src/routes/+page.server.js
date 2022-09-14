import { getDirectusClient } from '$lib/client';
import { formatRelativeTime } from '../../../shared/utils/format-relative-time';

/** @type {import('@sveltejs/kit').PageServerLoad} */
export async function load() {
	const directus = await getDirectusClient();

	let response;
	try {
		response = await directus.items('articles').readByQuery({
			fields: ['*', 'author.avatar', 'author.first_name', 'author.last_name'],
			sort: '-publish_date'
		});
	} catch (err) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return {
			status: 404
		};
	}

	const formattedArticles = response.data.map((article) => {
		return {
			...article,
			publish_date: formatRelativeTime(new Date(article.publish_date))
		};
	});

	if (!formattedArticles) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return {
			status: 404
		};
	}

	const [hero, ...articles] = formattedArticles;

	return {
		hero,
		articles
	};
}
