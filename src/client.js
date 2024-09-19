import client from '@sanity/client';

export default client({
    projectId: "7v8ls614",
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-09-17"
});