'use strict';

var _         = require('lodash');

var ejs       = require('ejs');
var pathFn    = require('path');
var fs        = require('fs');

var common      = require('./common.js');

var sitemapSrc  = pathFn.join(__dirname, '../sitemap.ejs');
var sitemapTmpl = ejs.compile(fs.readFileSync(sitemapSrc, 'utf8'));

var mentionedInPosts = function (category) {
    return (category.posts.length > 0);
};

module.exports = function(locals){
  var config = this.config;

  var posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(function(post){
      return post.sitemap !== false;
    })
    .sort(function(a, b){
      return b.updated - a.updated;
    });

  var categories = _(locals.categories.toArray())
            .filter(mentionedInPosts)
            .map(common.setItemLastUpdate)
            .sortByOrder('updated')
            .value();

  var tags = _(locals.tags.toArray())
            .filter(mentionedInPosts)
            .map(common.setItemLastUpdate)
            .sortByOrder('updated')
            .value();

  var xml = sitemapTmpl({
    config: config,
    posts: posts,
    categories: categories,
    tags: tags
  });

  return {
    path: config.sitemap.path,
    data: xml
  };
};