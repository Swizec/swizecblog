import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";
import Link from "gatsby-link";
import UserInfo from "../components/Accessories/UserInfo/UserInfo";
import Disqus from "../components/Accessories/Disqus/Disqus";
import PostTags from "../components/Posts/PostTags/PostTags";
import SocialLinks from "../components/Accessories/SocialLinks/SocialLinks";
import SEO from "../components/Accessories/SEO/SEO";
import config from "../../data/SiteConfig";
import TopNavigation from "../components/Layout/Navigation/Navigation";

export default class SimplePostTemplate extends React.Component {
    render() {
        const { slug } = this.props.pathContext;
        const postNode = this.props.data.wordpressPost;
        if (!postNode.id) {
            postNode.id = slug;
        }
        if (!postNode.category_id) {
            postNode.category_id = config.postDefaultCategoryID;
        }
        return <div>HAI There {postNode.id}</div>;
    }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
    query PostById2($id: String!) {
        wordpressPost(id: { eq: $id }) {
            slug
        }
        allWordpressPage {
            edges {
                node {
                    slug
                    title
                    id
                }
            }
        }
    }
`;
export const LineUp = graphql`
    fragment wpPost2 on wordpress__POST {
        id
    }
`;
