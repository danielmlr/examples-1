<script>
	throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import Hero from '$lib/components/Hero.svelte';
	import Article from '$lib/components/Article.svelte';

	export let hero, articles;
</script>

<main>
	<section class="main-content">
		<div class="container">
			<Hero article={hero} />
			<div class="articles-grid">
				{#each articles as article, index}
					<Article {article} bordered={index !== articles.length - 1} />
				{/each}
			</div>
		</div>
	</section>
</main>
