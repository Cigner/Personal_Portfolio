import createClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: "7v8ls614",
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-09-17"
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);