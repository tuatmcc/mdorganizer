import { NextPage } from 'next';

type Params = { slug: string[] };

export const BlogListPage: NextPage<Params> = () => {
  return <main dangerouslySetInnerHTML={}></main>;
};

export const generateStaticParams = async () => {
  return [];
};

export const getData = async (params: Params) => {
  return {};
};

export default BlogListPage;
