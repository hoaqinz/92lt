export function GET() {
  return new Response('This is a static route');
}

export function generateStaticParams() {
  return [
    { id: 'sample-post-1' },
    { id: 'sample-post-2' },
    { id: 'sample-post-3' }
  ];
}
