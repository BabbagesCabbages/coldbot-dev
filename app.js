/* jshint node:true */
var fs = require('fs');
var _ = require('lodash');

var site = require('apostrophe-site')();

var config = {

  // This line is required and allows apostrophe-site to use require() and manage our NPM modules for us.
  root: module,
  shortName: 'gutted-apostrophe',
  hostName: 'gutted-apostrophe',
  title: 'Gutted Apostrophe',
  sessionSecret: 'apostrophe sandbox demo party',
  adminPassword: 'demo',

  // Force a2 to prefix all of its URLs. It still
  // listens on its own port, but you can configure
  // your reverse proxy to send it traffic only
  // for URLs with this prefix. With this option
  // "/" becomes a 404, which is supposed to happen!

  // prefix: '/test',

  // If true, new tags can only be added by admins accessing
  // the tag editor modal via the admin bar. Sometimes useful
  // if your folksonomy has gotten completely out of hand
  lockTags: false,

  // Give users a chance to log in if they attempt to visit a page
  // which requires login
  secondChanceLogin: true,

  locals:  require('./lib/locals.js'),

  // sanitize html configs, add tags you want to allow the user to be able
  // to enter here..
  sanitizeHtml: {
    allowedTags: [ 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
  },
  // you can define lockups for areas here
  // lockups: {},

  // Here we define what page templates we have and what they will be called in the Page Types menu.

  // For html templates, the 'name' property refers to the filename in ./views/pages, e.g. 'default'
  // refers to '/views/pages/default.html'.

  // The name property can also refer to a module, in the case of 'blog', 'map', 'events', etc.

  pages: {
    types: [
      { name: 'default', label: 'Default Page' },
      { name: 'home', label: 'Home Page' },
      { name: 'blog', label: 'Blog' },
      { name: 'about', label: 'About'}
    ]
  },

  lockups: {
    left: {
      label: 'Left',
      tooltip: 'Inset Left',
      icon: 'icon-arrow-left',
      widgets: [ 'slideshow', 'video' ],
      slideshow: {
        size: 'one-half'
      }
    },
    right: {
      label: 'Right',
      tooltip: 'Inset Right',
      icon: 'icon-arrow-right',
      widgets: [ 'slideshow', 'video' ],
      slideshow: {
        size: 'one-half'
      }
    }
  },

  // These are the modules we want to bring into the project.
  modules: {
    // Styles required by the new editor, must go FIRST
    'apostrophe-editor-2': {},
    'apostrophe-ui-2': {},
    'apostrophe-blog-2': {
      perPage: 100,
      pieces: {
        addFields: [
          {
            name: '_author',
            type: 'joinByOne',
            withType: 'person',
            idField: 'authorId',
            label: 'Author'
          }
        ]
      }
    },
    'apostrophe-people': {
      addFields: [
        {
          name: '_blogPosts',
          type: 'joinByOneReverse',
          withType: 'blogPost',
          idField: 'authorId',
          label: 'Author',
          withJoins: [ '_editor' ]
        },
        {
          name: 'thumbnail',
          type: 'singleton',
          widgetType: 'slideshow',
          label: 'Picture',
          options: {
            aspectRatio: [100,100]
          }
        }
      ]
    },
    'apostrophe-groups': {},
    'apostrophe-browserify': {
      files: ["./public/js/modules/_site.js"]
    }
  },

  // These are assets we want to push to the browser.
  // The scripts array contains the names of JS files in /public/js,
  // while stylesheets contains the names of LESS files in /public/css
  assets: {
    stylesheets: ['site'],
    scripts: ['_site-compiled', 'vendor/highlight', 'vendor/reveal', 'vendor/gsap','vendor/tween', 'vendor/anim', 'vendor/bootstrap-switch','vendor/checkbox','vendor/html5shiv','vendor/imagesloaded','vendor/init','vendor/isotope','vendor/isotope.min','vendor/main','vendor/masonry','vendor/modernizr-2.8.3.min','vendor/radio','vendor/smoothScroll','vendor/switch','vendor/toolbar']
  },

  afterInit: function(callback) {
    // We're going to do a special console message now that the
    // server has started. Are we in development or production?
    var locals = require('./data/local');

    if(locals.development || !locals.minify) {
      console.error('Apostrophe Sandbox is running in development.');
    } else {
      console.error('Apostrophe Sandbox is running in production.');
    }

    callback(null);
  }

};

if (process.env.NODE_ENV === 'production') {
  _.extend(config, {
    uploadfs: {
      backend: 's3',
      secret: process.env.AWS_SECRET,
      key: process.env.AWS_KEY,
      bucket: process.env.S3_BUCKET_NAME,
      region: process.env.S3_REGION
    }
  });
}

site.init(config);
