import NewsReactionBar from './NewsReactionBar';
import NewsCommentSection from './NewsCommentSection';

function NewsEngagement({ post }) {
  if (!post?.id) return null;

  return (
    <section className="news-engagement" aria-label="Haber etkileşimi">
      <NewsReactionBar newsPostId={post.id} newsTitle={post.title} />
      <NewsCommentSection newsPostId={post.id} newsTitle={post.title} />
    </section>
  );
}

export default NewsEngagement;
