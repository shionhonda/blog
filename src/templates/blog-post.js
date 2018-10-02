import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import striptags from 'striptags'

import { rhythm, scale } from '../utils/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

import SNSShare from '../components/sns-share'
import Seo from '../components/seo';
import config from '../config/blog-config';



class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { previous, next, slug } = this.props.pathContext
    const postUrl = `${config.blogUrl}${slug}`;

    const tags = post.frontmatter.tags.map(tag => <div style={{
      borderRight: '1px solid #ccc',
      borderBottom: '1px solid #ccc',
      borderLeft: '1px solid #ccc',
      borderTop: '1px solid #ccc',
      borderRadius: '0.5em 0 0.5em 0',
      padding: '0.05em 0.75em',
      marginRight: '0.5em',
      fontWeight: 'bold',
      fontSize: '0.75em',
    }}>{tag}</div>)

    return (
      <article itemScope itemType="http://schema.org/BlogPosting">
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <Seo
          isRoot={false}
          title={`${post.frontmatter.title} | ${siteTitle}`}
          description={sumarrize(post.html)}
          postUrl={postUrl}
          postDate={post.frontmatter.date}
          />
        <a href={postUrl} rel="current">
          <h1　itemProp="name" className="articleTitle">
            {post.frontmatter.title}
          </h1>
        </a>

          <small style={{
                    color: '#99a',
                    fontFamily: 'sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '-0.5em 0 2em' }}>
            <div itemProp="dateModified" style={{marginRight:'2em', fontSize: '1.1em'}}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{marginRight: '0.5em' }}/>
              {post.frontmatter.date}
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <FontAwesomeIcon icon={faTags} style={{marginRight: '0.5em'}}/>
              {tags}
            </div>
          </small>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />

        <footer>
          <SNSShare
            title={post.frontmatter.title}
            link={postUrl}
            twitterUserName={config.blogAuthorTwitterUserName}
            />
          <ul
            style={{
              marginTop: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            <li>
              {
                previous &&
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              }
            </li>
            <li>
              {
                next &&
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              }
            </li>
          </ul>
        </footer>


      </article>
    )
  }
}

/**
 * ブログ記事から冒頭120字を取得.<br>
 * 120文字以上の場合は末尾に...をつける.
 *
 * @param {*} html ブログ記事(HTML形式)
 */
function sumarrize(html) {
  const postContent = striptags(html).replace(/\r?\n/g, '').trim();
  return postContent.length <= 120
    ? postContent
    : postContent.slice(0, 120) + '...';
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        title
        tags
      }
    }
  }
`