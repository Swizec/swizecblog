const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const webpackLodashPlugin = require("lodash-webpack-plugin");

// Will create pages for Wordpress posts (route : /{slug})

exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators;
    return new Promise((resolve, reject) => {
        graphql(
            `
                {
                    allWordpressPost {
                        edges {
                            node {
                                id
                                slug
                                modified
                                tags {
                                    name
                                }
                                categories {
                                    name
                                }
                            }
                        }
                    }
                }
            `
        ).then(result => {
            if (result.errors) {
                console.log(result.errors);
                reject(result.errors);
            }
            const tags = [];
            const categories = [];
            const postTemplate = path.resolve(`./src/templates/post.jsx`);
            const simplePostTemplate = path.resolve(
                `./src/templates/simplepost.jsx`
            );
            // We want to create a detailed page for each
            // post node. We'll just use the Wordpress Slug for the slug.
            // The Post ID is prefixed with 'POST_'
            console.log(
                "----- DOING WORDPRESS ---- ",
                result.data.allWordpressPost.edges.length
            );

            result.data.allWordpressPost.edges.forEach(edge => {
                console.log("BOOM", edge.node.slug);
                // grab all the tags and categories for later use
                edge.node.tags.forEach(tag => {
                    tags.push(tag.name);
                });
                edge.node.categories.forEach(category => {
                    categories.push(category.name);
                });

                console.log("CREATING PAGE FOR", edge.node.slug);

                createPage({
                    path: `/${edge.node.slug}`,
                    component: slash(simplePostTemplate),
                    context: {
                        id: edge.node.id
                    }
                });
            });
            // ==== END POSTS ====

            // Create pages for each unique tag and category
            const tagsTemplate = path.resolve(`./src/templates/tag.jsx`);
            const categoriesTemplate = path.resolve(
                `./src/templates/category.jsx`
            );
            const tagsSet = new Set(tags);
            const catSet = new Set(categories);
            tagsSet.forEach(tag => {
                createPage({
                    path: `/tags/${_.kebabCase(tag)}/`,
                    component: slash(tagsTemplate),
                    context: {
                        id: tag
                    }
                });
            });

            catSet.forEach(cat => {
                createPage({
                    path: `/categories/${_.kebabCase(cat)}/`,
                    component: slash(categoriesTemplate),
                    context: {
                        id: cat
                    }
                });
            });
        });
        resolve();
    });
    // === END TAGS ===
};

exports.modifyWebpackConfig = ({ config, stage }) => {
    if (stage === "build-javascript") {
        config.plugin("Lodash", webpackLodashPlugin, null);
    }
};
