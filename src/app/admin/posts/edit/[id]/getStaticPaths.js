export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: 'sample-post-1' } },
      { params: { id: 'sample-post-2' } },
      { params: { id: 'sample-post-3' } }
    ],
    fallback: 'blocking'
  };
}
